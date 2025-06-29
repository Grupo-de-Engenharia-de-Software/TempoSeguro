import { randomUUID } from "node:crypto";
import { Server as IOServer, Socket } from "socket.io";
import { MarkerData } from "src/services/map/map.service";

type ServerMarker = MarkerData & {
    id: string;
    approved: boolean;
    creatorId: string;
};

const markers: ServerMarker[] = [];

export const onConnect = (io: IOServer) => (socket: Socket) => {
    console.log("⚡️  client connected:", socket.id);

    socket.data.isAdmin = Boolean(socket.handshake.auth?.isAdmin);
    if (socket.data.isAdmin) {
        socket.join("admin")
        console.log("is admin", socket.rooms)
    }

    socket.on("isAdmin", () => {
        socket.data.isAdmin = true
        socket.join("admin")
    })

    const emitMarkers = (s: Socket) => {
        const data = s.data.isAdmin
            ? markers
            : markers.filter((m) => m.approved || m.creatorId === s.id);

        s.emit("markers", data);
    };

    emitMarkers(socket);

    // Cliente solicita lista de marcadores
    socket.on("get-markers", () => {
        emitMarkers(socket);
    });

    // Recebe novo marcador e avisa a todos
    socket.on("new-marker", (marker: MarkerData) => {
        const newMarker: ServerMarker = {
            ...marker,
            id: randomUUID(),
            approved: socket.data.isAdmin ?? false,
            creatorId: socket.id,
        };
        markers.push(newMarker);
        if (newMarker.approved) {
            io.emit("new-alert", newMarker);
        } else {
            io.to("admin").emit("markers", markers);
            io.to(socket.id).emit("markers", markers.filter((m) => m.approved || m.creatorId === socket.id));
        }
    });

    socket.on("approve-marker", (ids: string | string[]) => {
        const arr = Array.isArray(ids) ? ids : [ids];
        arr.forEach((id) => {
            const found = markers.find((m) => m.id === id);
            if (found && !found.approved) {
                found.approved = true;
                io.emit("new-alert", found);
            }
        });
    });
}