import { randomUUID } from "crypto";
// server.ts
import fs from "fs";
import { IncomingMessage, ServerResponse } from "http";
import { createServer } from "https";
import { ServerOptions } from "https";
import os from "os";
import { parse } from "url";
import chalk from "chalk";
import next from "next";
import pkg from "next/package.json";
import { Server as IOServer, Socket } from "socket.io";
import { MarkerData } from "src/services/map/map.service";

type ServerMarker = MarkerData & {
  id: string;
  approved: boolean;
  creatorId: string;
};

const markers: ServerMarker[] = [];

const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0";
const port = parseInt(process.env.PORT || "3000", 10);
const envFile = ".env"; // ou process.env.NODE_ENV==="production"?".env.production":".env"
const version = pkg.version; // pega a versão do Next.js do package.json

// Carregue seus arquivos gerados pelo mkcert (ou openssl)
const httpsOptions: ServerOptions<typeof IncomingMessage, typeof ServerResponse> = {
  key: fs.readFileSync("./localhost-key.pem"),
  cert: fs.readFileSync("./localhost.pem"),
};

// Função que retorna o primeiro IPv4 não-interno
function getNetworkIp(): string {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]!) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "127.0.0.1";
}

// Função que imprime o banner
function printBanner(startTime: number) {
  const elapsed = Date.now() - startTime;
  const localUrl = `https://localhost:${port}`;
  const networkIp = getNetworkIp();
  const networkUrl = `https://${networkIp}:${port}`;

  console.log();
  console.log(`${chalk.bold("▲")} Next.js ${version}`);
  console.log(` - Local:        ${localUrl}`);
  console.log(` - Network:      ${networkUrl}`);
  console.log(` - Environments: ${envFile}`);
  console.log();
  console.log(` ${chalk.green("✓ Starting...")}`);
  console.log(` ${chalk.green(`✓ Ready in ${elapsed}ms`)}`);
  console.log();
}

const app = next({ dev, hostname, port, turbopack: true, experimentalHttpsServer: true });
const handle = app.getRequestHandler();

const start = Date.now();
app.prepare().then(() => {
  const httpServer = createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  // anexa seu Socket.IO
  const io = new IOServer(httpServer, {
    path: "/socket.io", // default; just be sure your client matches
    cors: { origin: "*" },
  });
  io.on("connection", (socket) => {
    console.log("⚡️  client connected:", socket.id);

    socket.data.isAdmin = Boolean(socket.handshake.auth?.isAdmin);

    const emitMarkers = (s: Socket, justAdmin?: boolean) => {
      const data = s.data.isAdmin
        ? markers
        : markers.filter((m) => m.approved || m.creatorId === s.id);

      if (justAdmin) s.to("admin").emit("markers", data);
      else s.emit("markers", data);
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
        emitMarkers(socket, true);
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
  });

  httpServer.listen(port, hostname, () => {
    printBanner(start);
  });
});
