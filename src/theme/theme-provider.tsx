"use client";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider as CssVarsProvider } from "@mui/material/styles";
import type {} from "@mui/material/themeCssVarsAugmentation";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import type {} from "@mui/x-data-grid/themeAugmentation";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import type {} from "@mui/x-tree-view/themeAugmentation";

import { useSettingsContext } from "src/components/settings";
import { schemeConfig } from "./color-scheme-script";
import { createTheme } from "./create-theme";
import { RTL } from "./with-settings/right-to-left";

// ----------------------------------------------------------------------

type Props = {
	children: React.ReactNode;
};

export function ThemeProvider({ children }: Props) {
	const settings = useSettingsContext();

	const theme = createTheme(settings);

	return (
		<AppRouterCacheProvider options={{ key: "css" }}>
			<CssVarsProvider
				theme={theme}
				defaultMode={schemeConfig.defaultMode}
				modeStorageKey={schemeConfig.modeStorageKey}
			>
				<CssBaseline />
				<RTL direction={settings.direction}>{children}</RTL>
			</CssVarsProvider>
		</AppRouterCacheProvider>
	);
}
