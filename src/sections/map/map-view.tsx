"use client";

import Box from "@mui/material/Box";
import L from "leaflet";
window.L = L;
import "leaflet.awesome-markers";
import SecurityUpdateWarningRoundedIcon from "@mui/icons-material/SecurityUpdateWarningRounded";
import { Badge, Button, Fab, Stack, Typography } from "@mui/material";
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
import { socket } from "../../socket";
import { ALERT_TYPES, AlertType } from "./alerts.data";
import { ModalAlerts } from "./modal-alerts.component";
import { distanceKm } from "src/utils/geo";
import { playBeep, playSiren } from "src/utils/audio";

const { Overlay } = LayersControl;
const defaultPosition: [number, number] = [-30.0346, -51.2177];

type MarkerData = {
  id?: string;
  position: [number, number];
  title: string;
  type: string;
  approved?: boolean;
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

export default function MapView() {
  const [addingPos, setAddingPos] = useState<[number, number] | null>(null);
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [socketId, setSocketId] = useState<string>("");
  const { isAdmin } = useAuthContext();

  useEffect(() => {
    const handleMarkers = (data: Omit<MarkerData, "alert">[]) => {
      setMarkers(
        data.map((m) => ({
          ...m,
          alert:
            ALERT_TYPES.find((a) => a.type.toLowerCase() === m.type.toLowerCase()) ||
            ALERT_TYPES[0],
        })),
      );
    };

    const handleConnect = () => setSocketId(socket.id);
    const handleApproved = (m: MarkerData) => {
      if (!userPos) return;
      const distance = distanceKm(userPos, m.position);
      if (distance <= 1) playSiren();
      else if (distance <= 5) playBeep();
    };

    socket.on("connect", handleConnect);
    socket.on("markers", handleMarkers);
    socket.on("marker-approved", handleApproved);
    socket.emit("get-markers");
    return () => {
      socket.off("connect", handleConnect);
      socket.off("markers", handleMarkers);
      socket.off("marker-approved", handleApproved);
    };
  }, [userPos]);

  const handleAdd = (pos: [number, number]) => setAddingPos(pos);
  const handleSave = (alert: AlertType) => {
    if (!addingPos) return;
    socket.emit("new-marker", {
      position: addingPos,
      title: alert.label,
      type: alert.type,
    });
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
        (gr) =>
          distanceKm(gr.base.position, m.position) <= 0.05 &&
          gr.base.type === m.type,
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

  const badgeIcon = (alert: AlertType, count: number, color?: string) =>
    L.divIcon({
      html: `<div class="marker-wrapper"><div class="awesome-marker-icon-${color || alert.markerColor || "blue"} awesome-marker"><i class="fa ${alert.iconMarker}${alert.iconColor === "white" ? " icon-white" : ""}"${alert.iconColor && alert.iconColor !== "white" ? ` style=\"color:${alert.iconColor}\"` : ""}></i></div>${count > 1 ? `<span class="marker-badge">${count}</span>` : ""}</div>`,
      className: "",
      iconAnchor: [17, 42],
      popupAnchor: [1, -32],
    });

  const approvedMarkers = (
    <>
      {groupedApproved.map((g, i) => (
        <Marker
          key={`app-${i}`}
          position={g.base.position}
          icon={badgeIcon(g.base.alert, g.count, g.base.alert.markerColor)}
        >
          <Popup>
            <Typography variant="subtitle1">{g.base.title}</Typography>
            {g.count > 1 && (
              <Typography variant="caption">Repetido {g.count}x</Typography>
            )}
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
            <Overlay name="Marcadores Pendentes">
              <LayerGroup>
                {groupedPending.map((g, i) => (
                  <Marker
                    key={`pen-${i}`}
                    position={g.base.position}
                    icon={badgeIcon(g.base.alert, g.count, "red")}
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
