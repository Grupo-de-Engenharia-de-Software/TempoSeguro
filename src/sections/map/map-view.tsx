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
import { socket } from "../../socket";
import { ALERT_TYPES, AlertType } from "./alerts.data";
import { ModalAlerts } from "./modal-alerts.component";

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

function LocateUser() {
  const [pos, setPos] = useState<[number, number] | null>(null);
  const map = useMapEvents({
    locationfound(e) {
      const coords: [number, number] = [e.latlng.lat, e.latlng.lng];
      setPos(coords);
      map.flyTo(coords, 13);
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

    socket.on("markers", handleMarkers);
    socket.emit("get-markers");
    return () => {
      socket.off("markers", handleMarkers);
    };
  }, []);

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

  const approvedMarkers = (
    <>
      {approved.map((m, i) => (
        <Marker
          key={`app-${i}`}
          position={m.position}
          icon={L.AwesomeMarkers.icon({
            icon: m.alert.iconMarker,
            prefix: "fa",
            iconColor: m.alert.iconColor || "white",
            markerColor: m.alert.markerColor || "blue",
          })}
        >
          <Popup>{m.title}</Popup>
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
                {pending.map((m, i) => (
                  <Marker
                    key={`pen-${i}`}
                    position={m.position}
                    icon={L.AwesomeMarkers.icon({
                      icon: m.alert.iconMarker,
                      prefix: "fa",
                      iconColor: m.alert.iconColor || "white",
                      markerColor: m.alert.markerColor || "red",
                    })}
                  >
                    <Popup>
                      <Stack minWidth={200} gap={1}>
                        <Typography variant="subtitle1">{m.title}</Typography>
                        <Button size="small" onClick={() => socket.emit("approve-marker", m.id)}>
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
          </>
        )}

        <LocateUser />
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
