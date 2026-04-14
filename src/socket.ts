"use client";

import { io } from "socket.io-client";
import { LOCAL_EMAIL_STORAGE_KEY, STORAGE_KEY } from "src/auth/context/jwt/constant";

const socketOpts = {
  path: "/socket.io",
  autoConnect: false,
  auth: (cb: (data: { token: string | null; email: string | null }) => void) => {
    const token = typeof window !== "undefined" ? sessionStorage.getItem(STORAGE_KEY) : null;
    const email =
      typeof window !== "undefined" ? sessionStorage.getItem(LOCAL_EMAIL_STORAGE_KEY) : null;
    cb({ token, email });
  },
};

export const socket = process.env.NEXT_PUBLIC_SOCKET_URL
  ? io(process.env.NEXT_PUBLIC_SOCKET_URL, socketOpts)
  : io(socketOpts);
