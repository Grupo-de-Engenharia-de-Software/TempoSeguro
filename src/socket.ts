"use client";

import { io } from "socket.io-client";
import { LOCAL_EMAIL_STORAGE_KEY, STORAGE_KEY } from "src/auth/context/jwt/constant";

export const socket = io({
  path: "/socket.io",
  autoConnect: false,
  auth: (cb) => {
    const token = typeof window !== "undefined" ? sessionStorage.getItem(STORAGE_KEY) : null;
    const email = typeof window !== "undefined" ? sessionStorage.getItem(LOCAL_EMAIL_STORAGE_KEY) : null;
    cb({ token, email });
  },
});
