import { io } from "socket.io-client";

const url = process.env.NEXT_PUBLIC_BASE_SOCKET_URL || "http://localhost:3010";

export const socket = io(url, {
  withCredentials: true,
  transports: ["websocket", "polling"],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});
