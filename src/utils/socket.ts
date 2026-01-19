import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {
  if (typeof window === "undefined") return null;

  if (!socket) {
    const token = localStorage.getItem("accessToken");

    socket = io(process.env.NEXT_PUBLIC_BASE_SOCKET_URL!, {
      auth: { token },
      transports: ["websocket"],
    });
  }

  return socket;
};
