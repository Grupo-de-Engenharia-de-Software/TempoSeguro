import { extendTheme } from "@mui/material/styles";

import type { Theme } from "@mui/material/styles";
import { colorSchemes, components, customShadows, shadows, typography } from "./core";
import { overridesTheme } from "./overrides-theme.config";
import type { ThemeStoreValue } from "./theme.service";
import { updateComponentsWithSettings, updateCoreWithSettings } from "./with-settings/update-theme.theme-settings";

import type { ThemeUpdateOptions } from "./types.types";

// ----------------------------------------------------------------------
declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xxl: true; // adds the `mobile` breakpoint
  }
}
// ----------------------------------------------------------------------

export function createTheme(
  settings: ThemeStoreValue,
  overrides: ThemeUpdateOptions = {},
): Theme {
  const initialTheme = {
    colorSchemes,
    shadows: shadows(settings.themeMode),
    customShadows: customShadows(settings.themeMode),
    shape: { borderRadius: 8 },
    components,
    typography: {
      ...typography,
    },
    cssVarPrefix: "",
    shouldSkipGeneratingVar,
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1600,
        xxl: 2000
      },
    },
  }

  /**
   * 1.Update values from settings before creating theme.
   */
  const updateTheme = updateCoreWithSettings(initialTheme, settings);

  /**
   * 2.Create theme +  update component with settings.
   */
  const theme = extendTheme(
    updateTheme,
    updateComponentsWithSettings(settings),
    overridesTheme,
    overrides,
  );

  return theme;
}

// ----------------------------------------------------------------------

function shouldSkipGeneratingVar(keys: string[]): boolean {
  const skipGlobalKeys = [
    "mixins",
    "overlays",
    "direction",
    "breakpoints",
    "cssVarPrefix",
    "unstable_sxConfig",
    "typography",
    // 'transitions',
  ];

  const skipPaletteKeys: {
    [key: string]: string[];
  } = {
    global: ["tonalOffset", "dividerChannel", "contrastThreshold"],
    grey: ["A100", "A200", "A400", "A700"],
    text: ["icon"],
  };

  const isPaletteKey = keys[0] === "palette";

  if (isPaletteKey) {
    const paletteType = keys[1];
    const skipKeys = skipPaletteKeys[paletteType] || skipPaletteKeys.global;

    return keys.some((key) => skipKeys?.includes(key));
  }

  return keys.some((key) => skipGlobalKeys?.includes(key));
}

/**
* createTheme without @settings and @locale components.
*
 ```jsx
export function createTheme(): Theme {
  const initialTheme = {
    colorSchemes,
    shadows: shadows('light'),
    customShadows: customShadows('light'),
    shape: { borderRadius: 8 },
    components,
    typography,
    cssVarPrefix: '',
    shouldSkipGeneratingVar,
  };

  const theme = extendTheme(initialTheme, overridesTheme);

  return theme;
}
 ```
*/
