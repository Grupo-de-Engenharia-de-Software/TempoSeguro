import type { } from "@mui/material/themeCssVarsAugmentation";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider as ThemeProviderMui } from "@mui/material/styles";

import { Mode } from "@mui/system/cssVars/useCurrentColorScheme";
import { createTheme } from "./create-theme.util";
import { ThemeService } from "./theme.service";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
  themeDefaultType?: Mode | undefined;
};

export function ThemeProvider({ children }: Props) {

  const themeStore = ThemeService.useStore();

  const theme = createTheme(themeStore, { colorSchemeSelector: "data-mui-color-scheme" });

  return (
    <ThemeProviderMui theme={theme} defaultMode="light" modeStorageKey="theme-mode" >
      <CssBaseline />
      {children}
    </ThemeProviderMui>
  );
}
