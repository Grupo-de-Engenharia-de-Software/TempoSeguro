import { randomUUID } from "node:crypto";
import { Server as IOServer, Socket } from "socket.io";
import type { AuthUser } from "server/middleware/auth";
import { checkRateLimit, cleanupSocket } from "server/middleware/rate-limit";
import { ApproveMarkerSchema, NewMarkerSchema } from "server/validation";

type MarkerData = {
  position: [number, number];
  title: string;
  type: string;
};

type ServerMarker = MarkerData & {
  id: string;
  approved: boolean;
  creatorId: string;
};

const markers: ServerMarker[] = [];

export const onConnect = (io: IOServer) => (socket: Socket) => {
  const user: AuthUser = socket.data.user;

  if (user.isAdmin) {
    socket.join("admin");
  }

  const emitMarkers = (s: Socket) => {
    const data = s.data.user.isAdmin
      ? markers
      : markers.filter((m) => m.approved || m.creatorId === s.data.user.id);
    s.emit("markers", data);
  };

  emitMarkers(socket);

  socket.on("get-markers", () => {
    if (!checkRateLimit(socket.id, "get-markers")) return;
    emitMarkers(socket);
  });

  socket.on("new-marker", (raw: unknown) => {
    if (!checkRateLimit(socket.id, "new-marker")) return;

    const parsed = NewMarkerSchema.safeParse(raw);
    if (!parsed.success) return;

    const marker = parsed.data;
    const newMarker: ServerMarker = {
      position: marker.position,
      title: marker.title,
      type: marker.type,
      id: randomUUID(),
      approved: user.isAdmin,
      creatorId: user.id,
    };

    markers.push(newMarker);

    if (newMarker.approved) {
      io.emit("new-alert", newMarker);
    } else {
      io.to("admin").emit("markers", markers);
      io.to(socket.id).emit(
        "markers",
        markers.filter((m) => m.approved || m.creatorId === user.id),
      );
    }
  });

  socket.on("approve-marker", (raw: unknown) => {
    if (!user.isAdmin) return;
    if (!checkRateLimit(socket.id, "approve-marker")) return;

    const parsed = ApproveMarkerSchema.safeParse(raw);
    if (!parsed.success) return;

    const ids = Array.isArray(parsed.data) ? parsed.data : [parsed.data];
    for (const id of ids) {
      const found = markers.find((m) => m.id === id);
      if (found && !found.approved) {
        found.approved = true;
        io.emit("new-alert", found);
      }
    }
  });

  socket.on("disconnect", () => {
    cleanupSocket(socket.id);
  });
};
