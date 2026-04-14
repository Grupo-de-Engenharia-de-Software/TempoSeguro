import { z } from "zod";
import type { Socket } from "socket.io";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const AUTH_API_BASE_URL =
  process.env.AUTH_API_BASE_URL || "https://api-dev-minimal-v6.vercel.app";

const ADMIN_EMAILS: ReadonlySet<string> = new Set(
  (process.env.ADMIN_EMAILS || "admin@admin.com")
    .split(",")
    .map((e) => e.trim().toLowerCase()),
);

// ---------------------------------------------------------------------------
// Token validation cache (token -> validated result, 60s TTL)
// ---------------------------------------------------------------------------

export interface AuthUser {
  id: string;
  displayName: string;
  email: string;
  localEmail: string;
  isAdmin: boolean;
}

interface CachedAuth {
  user: AuthUser;
  expiresAt: number;
}

const CACHE_TTL_MS = 60_000;
const authCache = new Map<string, CachedAuth>();

function getCached(token: string): AuthUser | null {
  const entry = authCache.get(token);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    authCache.delete(token);
    return null;
  }
  return entry.user;
}

function setCache(token: string, user: AuthUser): void {
  if (authCache.size > 500) {
    const now = Date.now();
    authCache.forEach((v, k) => {
      if (now > v.expiresAt) authCache.delete(k);
    });
  }
  authCache.set(token, { user, expiresAt: Date.now() + CACHE_TTL_MS });
}

// ---------------------------------------------------------------------------
// Zod schema for the external /api/auth/me response
// ---------------------------------------------------------------------------

const MeResponseSchema = z.object({
  user: z
    .object({
      id: z.string(),
      displayName: z.string(),
      email: z.string().email(),
    })
    .passthrough(),
});

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

export async function authMiddleware(
  socket: Socket,
  next: (err?: Error) => void,
): Promise<void> {
  const token: unknown = socket.handshake.auth?.token;
  const localEmail: unknown = socket.handshake.auth?.email;

  if (!token || typeof token !== "string") {
    return next(new Error("AUTH_NO_TOKEN"));
  }

  // Check cache
  const cached = getCached(token);
  if (cached) {
    socket.data.user = cached;
    return next();
  }

  // Validate via external API
  try {
    const response = await fetch(`${AUTH_API_BASE_URL}/api/auth/me`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(5_000),
    });

    if (!response.ok) {
      return next(new Error("AUTH_INVALID_TOKEN"));
    }

    const body = await response.json();
    const parsed = MeResponseSchema.safeParse(body);

    if (!parsed.success) {
      return next(new Error("AUTH_INVALID_RESPONSE"));
    }

    const emailForRole =
      typeof localEmail === "string" ? localEmail.toLowerCase().trim() : "";
    const isAdmin = ADMIN_EMAILS.has(emailForRole);

    const user: AuthUser = {
      id: parsed.data.user.id,
      displayName: parsed.data.user.displayName,
      email: parsed.data.user.email,
      localEmail: emailForRole,
      isAdmin,
    };

    socket.data.user = user;
    setCache(token, user);

    return next();
  } catch (err) {
    if (err instanceof DOMException && err.name === "TimeoutError") {
      return next(new Error("AUTH_API_TIMEOUT"));
    }
    return next(new Error("AUTH_API_ERROR"));
  }
}
