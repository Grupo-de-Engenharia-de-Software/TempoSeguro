"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import L from "leaflet";
import 'leaflet.awesome-markers';  
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";

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
    <Marker
      position={pos}
      icon={
        new L.AwesomeMarkers.Icon({
          icon: "location-crosshairs",
          markerColor: "blue",
          prefix: "fa"
        })
      }
    >
      <Popup>Você está aqui</Popup>
    </Marker>
  );
}

export default function MapView() {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [addingPos, setAddingPos] = useState<[number, number] | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("ts_markers");
    if (stored) setMarkers(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("ts_markers", JSON.stringify(markers));
  }, [markers]);

  const handleAdd = (pos: [number, number]) => {
    setAddingPos(pos);
  };

  const handleSave = () => {
    if (!addingPos) return;
    setMarkers((prev) => [...prev, { position: addingPos, title, description }]);
    setAddingPos(null);
    setTitle("");
    setDescription("");
  };

  return (
    <Box sx={{ flex: 1, position: "relative" }}>
      <MapContainer center={defaultPosition} zoom={13} style={{ height: "calc(100vh - 64px)", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* marcador da localização do usuário */}
        <LocateUser />

        {markers.map((m, idx) => (
          <Marker
            key={idx}
            position={m.position}
            icon={L.icon({
              iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

              iconSize: [25, 41],
              iconAnchor: [12, 41],
            })}
          >
            <Popup>
              <strong>{m.title}</strong>
              <br />
              {m.description}
            </Popup>
          </Marker>
        ))}

        <AddMarker onAdd={handleAdd} />
      </MapContainer>

      {addingPos && (
        <Box
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            p: 2,
            bgcolor: "background.paper",
            borderRadius: 1,
            boxShadow: 3,
            zIndex: 1000,
          }}
        >
          <Stack spacing={1}>
            <TextField label="Título" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth />
            <TextField
              label="Descrição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
            />
            <Stack direction="row" spacing={1}>
              <Button variant="contained" onClick={handleSave} disabled={!title}>
                Salvar
              </Button>
              <Button variant="outlined" onClick={() => setAddingPos(null)}>
                Cancelar
              </Button>
            </Stack>
          </Stack>
        </Box>
      )}
    </Box>
  );
}
