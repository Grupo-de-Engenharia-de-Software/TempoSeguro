import type { ColorSystemOptions, Components, Theme } from "@mui/material/styles";
import COLORS from "../core/colors.json";
import { components as coreComponents } from "../core/components";
import { customShadows as coreCustomShadows, createShadowColor } from "../core/custom-shadows.config";
import { primary as corePrimaryPalette } from "../core/palette.config";
import { createPaletteChannel } from "../styles";
import type { ThemeStoreValue } from "../theme.service";
import type { ThemeComponents, ThemeUpdateOptions } from "../types.types";
import PRIMARY_COLOR from "./primary-color.json";

// ----------------------------------------------------------------------

/**
 * [1] settings @primaryColor
 * [2] settings @contrast
 */

export function updateCoreWithSettings(theme: ThemeUpdateOptions, settings: ThemeStoreValue): ThemeUpdateOptions {
  const { colorSchemes, customShadows } = theme;

  return {
    ...theme,
    colorSchemes: {
      ...colorSchemes,
      light: {
        palette: {
          ...(colorSchemes?.light as ColorSystemOptions)?.palette,
          /** [1] */
          primary: getPalettePrimary(settings.primaryColor),
        },
      },
      dark: {
        palette: {
          ...(colorSchemes?.dark as ColorSystemOptions)?.palette,
          /** [1] */
          primary: getPalettePrimary(settings.primaryColor),
        },
      },
    },
    customShadows: {
      ...customShadows,
      /** [1] */
      primary: settings.primaryColor === "default" ? coreCustomShadows("light").primary : createShadowColor(getPalettePrimary(settings.primaryColor).mainChannel),
    },
  };
}

// ----------------------------------------------------------------------

export function updateComponentsWithSettings(settings: ThemeStoreValue) {
  const components: ThemeComponents = {};

  /** [2] */
  if (settings.themeContrast === "bold") {
    const MuiCard: Components<Theme>["MuiCard"] = {
      styleOverrides: {
        root: ({ theme, ownerState }) => {
          let rootStyles = {};
          if (typeof coreComponents?.MuiCard?.styleOverrides?.root === "function") {
            rootStyles =
              coreComponents.MuiCard.styleOverrides.root({
                ownerState,
                theme,
              }) ?? {};
          }

          return {
            ...rootStyles,
            boxShadow: theme.customShadows.z1,
          };
        },
      },
    };

    components.MuiCard = MuiCard;
  }

  return { components };
}

// ----------------------------------------------------------------------

const PRIMARY_COLORS = {
  default: COLORS.primary,
  cyan: PRIMARY_COLOR.cyan,
  purple: PRIMARY_COLOR.purple,
  blue: PRIMARY_COLOR.blue,
  orange: PRIMARY_COLOR.orange,
  red: PRIMARY_COLOR.red,
};

function getPalettePrimary(primaryColorName: ThemeStoreValue["primaryColor"]) {
  /** [1] */
  const selectedPrimaryColor = PRIMARY_COLORS[primaryColorName];
  const updatedPrimaryPalette = createPaletteChannel(selectedPrimaryColor);

  return primaryColorName === "default" ? corePrimaryPalette : updatedPrimaryPalette;
}
