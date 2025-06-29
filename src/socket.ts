"use client";

import { io } from "socket.io-client";

export const socket = io({
  path: "/socket.io",
  auth: {
    isAdmin:
      typeof window !== "undefined" &&
      sessionStorage.getItem("jwt_is_admin") === "true",
  },
});