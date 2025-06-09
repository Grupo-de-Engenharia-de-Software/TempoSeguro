import { create } from "zustand";
import { ThemeColorScheme } from "./types.types";

export type ThemeStoreValue = {
  themeStretch: boolean;
  themeMode: ThemeColorScheme;
  themeContrast: "default" | "bold";
  themeLayout: "vertical" | "horizontal" | "mini";
  navColor: "integrate" | "apparent";
  primaryColor: "default" | "cyan" | "purple" | "blue" | "orange" | "red";
};

export type ThemeOptionsMenu = {
  canReset: boolean;
  open: boolean;
  handleOpen: () => void;
  handleClose: () => void;
};

export type ThemeStoreActions = {
  themeReset: () => void;
  onUpdate: (key: keyof ThemeStoreValue, value: any) => void;
};

const defaultValues: ThemeStoreValue & { open: boolean; canReset: boolean } = {
  themeStretch: false,
  themeMode: "light",
  themeContrast: "bold",
  themeLayout: window.innerWidth < 1536 ? "mini" : "vertical",
  primaryColor: "default",
  navColor: "integrate",
  canReset: false,
  open: false,
};

const persistedSettings = ["themeStretch", "themeMode", "themeContrast"];

const initialValues = Object.fromEntries(
  Object.entries(defaultValues).map(([key, value]) => {
    if (!persistedSettings.includes(key)) return [key, value];
    const v = window.localStorage.getItem(key);
    return [key, v ? JSON.parse(v) : value];
  }),
);

const useStore = create<ThemeStoreValue & ThemeStoreActions & ThemeOptionsMenu>((set) => ({
  ...(initialValues as any),
  themeReset: () => set({ ...initialValues }),
  onUpdate: (key, value) => {
    window.localStorage.setItem(key, JSON.stringify(value));
    set({ [key]: value, canReset: true });
  },
  handleOpen: () => set({ open: true }),
  handleClose: () => set({ open: false }),
}));

export const ThemeService = {
  useStore,
};
