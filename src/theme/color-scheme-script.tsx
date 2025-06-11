"use client";

import { InitColorSchemeScript } from "@mui/material";
import { defaultSettings } from "src/components/settings";

// ----------------------------------------------------------------------

export const schemeConfig = {
  modeStorageKey: "theme-mode",
  defaultMode: defaultSettings.colorScheme,
};

export const getInitColorSchemeScript = (
  <InitColorSchemeScript key="colors" modeStorageKey={schemeConfig.modeStorageKey} defaultMode={schemeConfig.defaultMode} />
);
