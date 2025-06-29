"use client";

import Box from "@mui/material/Box";
import L from "leaflet";
window.L = L;
import "leaflet.awesome-markers";
import SecurityUpdateWarningRoundedIcon from "@mui/icons-material/SecurityUpdateWarningRounded";
import { Button, Fab, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {
  CircleMarker,
  LayerGroup,
  LayersControl,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import { useAuthContext } from "src/auth/hooks";
import { playBeep, playSiren } from "src/utils/audio";
import { distanceKm } from "src/utils/geo";
import { socket } from "../../socket";
import { ALERT_TYPES, AlertType } from "./alerts.data";
import { ModalAlerts } from "./modal-alerts.component";

const { Overlay } = LayersControl;
const defaultPosition: [number, number] = [-30.0346, -51.2177];

export type MarkerData = {
  id?: string;
  position: [number, number];
  title: string;
  type: string;
  approved?: boolean;
  creatorId?: string;
  alert: AlertType;
};

function AddMarker({ onAdd }: { onAdd: (pos: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      onAdd([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

function LocateUser({
  onLocate,
}: {
  onLocate?: (pos: [number, number]) => void;
}) {
  const [pos, setPos] = useState<[number, number] | null>(null);
  const map = useMapEvents({
    locationfound(e) {
      const coords: [number, number] = [e.latlng.lat, e.latlng.lng];
      setPos(coords);
      map.flyTo(coords, 13);
      onLocate?.(coords);
    },
    locationerror(err) {
      console.error("Erro ao obter localização:", err.message);
    },
  });

  useEffect(() => {
    map.locate();
  }, [map]);

  return pos ? (
    <CircleMarker center={pos} radius={8}>
      <Popup>Você está aqui</Popup>
    </CircleMarker>
  ) : null;
}

const createMarker = (data: Omit<MarkerData, "alert">): MarkerData => {
  const alert = ALERT_TYPES.find((a) => a.type.toLowerCase() === data.type.toLowerCase());
  return {
    ...data,
    alert: alert || ALERT_TYPES[0],
    id: data.id || crypto.randomUUID(),
    approved: data.approved ?? false,
    creatorId: data.creatorId || "",
  };
};

export default function MapView() {
  const [addingPos, setAddingPos] = useState<[number, number] | null>(null);
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [socketId, setSocketId] = useState<string>("");
  const { isAdmin } = useAuthContext();

  useEffect(() => {
    const handleMarkers = (data: Omit<MarkerData, "alert">[]) => {
      setMarkers(data.map(createMarker));
    };

    const handleConnect = () => {
      if (isAdmin) (socket as any).join("admin");
      return setSocketId(socket.id!);
    };
    const handleNewAlert = (m: MarkerData) => {
      let existed = false;
      setMarkers((prev) => {
        const existing = prev.find(
          (marker) => marker.type === m.type && marker.position[0] === m.position[0] && marker.position[1] === m.position[1],
        );
        console.log({ existing, prev, m });
        if (existing) {
          existed = true;
          return prev.map((marker) =>
            marker.id === m.id ? createMarker({ ...marker, ...m }) : marker,
          );
        }
        return [...prev, createMarker(m)];
      });

      if (!userPos || existed) return;
      const distance = distanceKm(userPos, m.position);
      if (distance <= 1) playSiren();
      else if (distance <= 5) playBeep();
    };

    socket.on("markers", handleMarkers);
    socket.on("new-alert", handleNewAlert);
    socket.emit("get-markers");
    return () => {
      socket.off("connect", handleConnect);
      socket.off("markers", handleMarkers);
      socket.off("new-alert", handleNewAlert);
    };
  }, [userPos, isAdmin]);

  const handleAdd = (pos: [number, number]) => setAddingPos(pos);
  const handleSave = (alert: AlertType) => {
    if (!addingPos) return;
    socket.emit("new-marker", {
      position: addingPos,
      title: alert.label,
      type: alert.type,
    });
    setMarkers((prev) => [
      ...prev,
      createMarker({
        position: addingPos,
        title: alert.label,
        type: alert.type,
        approved: isAdmin,
        creatorId: socketId,
      }),
    ]);
    setAddingPos(null);
  };

  // separa arrays
  const approved = markers.filter((m) => m.approved);
  const pending = markers.filter((m) => !m.approved);

  type Grouped = { base: MarkerData; ids: string[]; count: number };

  const groupMarkers = (list: MarkerData[]) => {
    const groups: Grouped[] = [];
    list.forEach((m) => {
      const g = groups.find(
        (gr) => distanceKm(gr.base.position, m.position) <= 0.05 && gr.base.type === m.type,
      );
      if (g) {
        g.count += 1;
        m.id && g.ids.push(m.id);
      } else {
        groups.push({ base: m, ids: m.id ? [m.id] : [], count: 1 });
      }
    });
    return groups;
  };

  const groupedApproved = groupMarkers(approved);
  const groupedPending = groupMarkers(pending);

  const approvedMarkers = (
    <>
      {groupedApproved.map((g, i) => (
        <Marker
          key={`app-${i}`}
          position={g.base.position}
          icon={L.AwesomeMarkers.icon({
            icon: g.base.alert.iconMarker,
            prefix: "fa",
            iconColor: g.base.alert.iconColor || "white",
            markerColor: g.base.alert.markerColor || "red",
          })}
        >
          <Popup>
            <Typography variant="subtitle1">{g.base.title}</Typography>
            {g.count > 1 && <Typography variant="caption">Repetido {g.count}x</Typography>}
          </Popup>
        </Marker>
      ))}
    </>
  );

  return (
    <Box sx={{ flex: 1, position: "relative" }}>
      <MapContainer
        center={defaultPosition}
        zoom={13}
        style={{ height: "calc(100vh - 72px)", width: "100%" }}
      >
        {isAdmin ? (
          <LayersControl position="topright">
            {/* camada base */}
            <LayersControl.BaseLayer checked name="OpenStreetMap">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>

            {/* camada de marcadores aprovados */}
            <Overlay checked name="Marcadores Aprovados">
              <LayerGroup>{approvedMarkers}</LayerGroup>
            </Overlay>

            {/* camada de marcadores pendentes */}
            <Overlay name="Marcadores Pendentes" checked>
              <LayerGroup>
                {groupedPending.map((g, i) => (
                  <Marker
                    key={`pen-${i}`}
                    position={g.base.position}
                    icon={L.AwesomeMarkers.icon({
                      icon: g.base.alert.iconMarker,
                      prefix: "fa",
                      iconColor: g.base.alert.iconColor || "white",
                      markerColor: g.base.alert.markerColor || "red",
                    })}
                    opacity={0.7}
                  >
                    <Popup>
                      <Stack minWidth={200} gap={1}>
                        <Typography variant="subtitle1">{g.base.title}</Typography>
                        {g.count > 1 && (
                          <Typography variant="caption">Repetido {g.count}x</Typography>
                        )}
                        <Button size="small" onClick={() => socket.emit("approve-marker", g.ids)}>
                          Aprovar
                        </Button>
                      </Stack>
                    </Popup>
                  </Marker>
                ))}
              </LayerGroup>
            </Overlay>
          </LayersControl>
        ) : (
          <>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {approvedMarkers}
            {pending
              .filter((m) => m.creatorId === socketId)
              .map((m, i) => (
                <Marker
                  key={`my-${i}`}
                  position={m.position}
                  opacity={0.5}
                  icon={L.AwesomeMarkers.icon({
                    icon: m.alert.iconMarker,
                    prefix: "fa",
                    iconColor: m.alert.iconColor || "white",
                    markerColor: m.alert.markerColor || "red",
                  })}
                >
                  <Popup>{m.title}</Popup>
                </Marker>
              ))}
          </>
        )}

        <LocateUser onLocate={setUserPos} />
        <AddMarker onAdd={handleAdd} />
      </MapContainer>

      <Fab
        color="secondary"
        size="large"
        onClick={() => setAddingPos(defaultPosition)}
        sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1000 }}
      >
        <SecurityUpdateWarningRoundedIcon />
      </Fab>
      <ModalAlerts
        handleClose={() => setAddingPos(null)}
        position={addingPos}
        onSave={handleSave}
      />
    </Box>
  );
}
