// server.socket.ts — Standalone Socket.IO server (no Next.js).
// Deploy this separately (Railway, Render, Fly.io, etc.)
// while the Next.js frontend deploys to Vercel.

import { createServer } from "node:http";
import { Server as IOServer } from "socket.io";
import { authMiddleware } from "server/middleware/auth";
import { onConnect } from "server/socket";

const port = parseInt(process.env.PORT || "3001", 10);

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",").map((o) => o.trim()) || [];

const httpServer = createServer((_req, res) => {
  // Health-check endpoint for platform probes
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("ok");
});

const io = new IOServer(httpServer, {
  path: "/socket.io",
  cors: { origin: allowedOrigins },
});

io.use(authMiddleware);
io.on("connection", onConnect(io));

httpServer.listen(port, "0.0.0.0", () => {
  console.log(`Socket.IO server listening on port ${port}`);
});
