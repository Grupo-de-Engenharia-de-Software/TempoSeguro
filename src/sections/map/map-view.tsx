"use client";

import Box from "@mui/material/Box";
import L from "leaflet";
window.L = L; // necessário para o Leaflet funcionar corretamente com o React
import "leaflet.awesome-markers";
import SecurityUpdateWarningRoundedIcon from '@mui/icons-material/SecurityUpdateWarningRounded';
import { Fab } from "@mui/material";
import { useEffect, useState } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { ModalAlerts } from "./modal-alerts.component";

const defaultPosition: [number, number] = [-30.0346, -51.2177];

export type MarkerData = {
  position: [number, number];
  title: string;
  description: string;
};

function AddMarker({ onAdd }: { onAdd: (pos: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      onAdd([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

// Novo componente para localizar o usuário
function LocateUser() {
  const [pos, setPos] = useState<[number, number] | null>(null);
  const map = useMap();

  useEffect(() => {
    map.locate(); // inicia a localização
    map.on("locationfound", (e: L.LocationEvent) => {
      const coords: [number, number] = [e.latlng.lat, e.latlng.lng];
      setPos(coords);
      map.flyTo(e.latlng, 13); // centraliza o mapa suavemente
    });
    map.on("locationerror", (err: L.ErrorEvent) => {
      console.error("Erro ao obter localização:", err.message);
    });
    // cleanup dos listeners
    return () => {
      map.off("locationfound");
      map.off("locationerror");
    };
  }, [map]);

  if (!pos) return null;
  return (
    <CircleMarker center={pos} radius={8}>
      <Popup>Você está aqui</Popup>
    </CircleMarker>
  );
}

export default function MapView() {
  const [addingPos, setAddingPos] = useState<[number, number] | null>(null);

  const handleAdd = (pos: [number, number]) => {
    setAddingPos(pos);
  };


  return (
    <Box sx={{ flex: 1, position: "relative" }}>
      <MapContainer center={defaultPosition} zoom={13} style={{ height: "calc(100vh - 72px)", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* marcador da localização do usuário */}
        <LocateUser />

        <AddMarker onAdd={handleAdd} />
      </MapContainer>
      <Fab
        color="secondary"
        size="large"
        onClick={() => setAddingPos(defaultPosition)} 
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 1000,
        }}
      >
        <SecurityUpdateWarningRoundedIcon/>
      </Fab>
      <ModalAlerts handleClose={() => setAddingPos(null)} position={addingPos} onSave={() => {}} />
    </Box>
  );
}
