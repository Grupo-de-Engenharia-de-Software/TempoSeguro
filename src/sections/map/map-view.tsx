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
import { MapService } from "src/services/map/map.service";
import { socket } from "../../socket";
import { ModalAlerts } from "./modal-alerts.component";

const { Overlay } = LayersControl;

function AddMarker() {
  useMapEvents({
    click(e) {
      MapService.useStore.setState({ addingPos: [e.latlng.lat, e.latlng.lng] });
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
      MapService.useStore.setState({ userPos: coords });
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
  const { isAdmin } = useAuthContext();
  const { groupedApproved, groupedPending, pendingFromUser } = MapService.useMarkers();

  MapService.useInit();

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
        center={MapService.defaultPosition}
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
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => socket.emit("approve-marker", g.ids)}
                        >
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
            {pendingFromUser.map((m, i) => (
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

        <LocateUser />
        <AddMarker />
      </MapContainer>

      <Fab
        color="secondary"
        size="large"
        onClick={() =>
          MapService.useStore.setState((p) => ({
            addingPos: p.userPos || MapService.defaultPosition,
          }))
        }
        sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1000 }}
      >
        <SecurityUpdateWarningRoundedIcon />
      </Fab>
      <ModalAlerts />
    </Box>
  );
}
