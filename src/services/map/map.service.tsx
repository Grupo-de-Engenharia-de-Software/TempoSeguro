import { useCallback, useEffect, useMemo } from "react";
import { useAuthContext } from "src/auth/hooks";
import { socket } from "src/socket";
import { playBeep, playSiren } from "src/utils/audio";
import { distanceKm } from "src/utils/geo";
import { create } from "zustand";
import { toastAlert } from "./aler-toast.component";
import { ALERT_TYPES, AlertType } from "./alerts.data";

export type MarkerData = {
  id?: string;
  position: [number, number];
  title: string;
  type: string;
  approved?: boolean;
  creatorId?: string;
  alert: AlertType;
};

const defaultPosition: [number, number] = [-30.0346, -51.2177];

interface MapStore {
  socketId: string;
  markers: MarkerData[];
  addingPos: [number, number] | null;
  userPos: [number, number];
  setMarkers: (markers: MarkerData[] | ((markers: MarkerData[]) => MarkerData[])) => void;
}

const useStore = create<MapStore>(() => ({
  socketId: "",
  markers: [] as MarkerData[],
  addingPos: null as [number, number] | null,
  userPos: [0, 0] as [number, number],
  setMarkers: (markers) => {
    useStore.setState((state) => ({
      markers: typeof markers === "function" ? markers(state.markers) : markers,
    }));
  },
}));

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

const useInit = () => {
  const { isAdmin } = useAuthContext();
  const userPos = useStore((state) => state.userPos);

  useEffect(() => {
    const setMarkers = useStore.getState().setMarkers;

    const handleMarkers = (data: Omit<MarkerData, "alert">[]) => {
      const nMarkers = data.map(createMarker);
      setMarkers(nMarkers);
      console.log("data.map(createMarker): ", nMarkers);
    };

    const handleConnect = () => {
      if (isAdmin) socket.emit("isAdmin");
      return useStore.setState({ socketId: socket.id! });
    };
    const handleNewAlert = (m: MarkerData) => {
      let existed = false;
      setMarkers((prev) => {
        const existing = prev.find((marker) => marker.id === m.id);
        if (existing) {
          existed = true;
          return prev.map((marker) =>
            marker.id === m.id ? createMarker({ ...marker, ...m }) : marker,
          );
        }
        return [...prev, createMarker(m)];
      });

      if (!userPos || existed || m.creatorId === socket.id) return;
      const distance = distanceKm(userPos, m.position);
      if (distance <= 1) {
        playSiren();
        toastAlert(1);
      } else if (distance <= 5) {
        playBeep();
        toastAlert(5);
      }
    };

    socket.on("connect", handleConnect);
    socket.on("markers", handleMarkers);
    socket.on("new-alert", handleNewAlert);
    socket.emit("get-markers");
    return () => {
      socket.off("connect", handleConnect);
      socket.off("markers", handleMarkers);
      socket.off("new-alert", handleNewAlert);
    };
  }, [userPos, isAdmin]);
};

const useAddAlert = () => {
  const addingPos = useStore((state) => state.addingPos);

  return useCallback(
    (alert: AlertType) => {
      if (!addingPos) return;
      socket.emit("new-marker", {
        position: addingPos,
        title: alert.label,
        type: alert.type,
      });
      useStore.setState(() => ({
        addingPos: null,
      }));
    },
    [addingPos],
  );
};

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

const useMarkers = () => {
  const markers = useStore((state) => state.markers);

  const approved = useMemo(() => markers.filter((m) => m.approved), [markers]);
  const pending = useMemo(() => markers.filter((m) => !m.approved), [markers]);

  const groupedApproved = useMemo(() => groupMarkers(approved), [approved]);
  const groupedPending = useMemo(() => groupMarkers(pending), [pending]);

  const pendingFromUser = useMemo(
    () => pending.filter((p) => p.creatorId === socket.id),
    [pending],
  );

  return {
    groupedApproved,
    groupedPending,
    pendingFromUser,
  };
};

export const MapService = {
  useStore,
  useInit,
  useAddAlert,
  createMarker,
  useMarkers,
  defaultPosition,
};
