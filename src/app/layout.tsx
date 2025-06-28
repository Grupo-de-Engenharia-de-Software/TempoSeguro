import "src/global.css";

// ----------------------------------------------------------------------

import type { Viewport } from "next";

import { CONFIG } from "src/config-global";
import { getInitColorSchemeScript } from "src/theme/color-scheme-script";
import { primary } from "src/theme/core/palette";
import { ThemeProvider } from "src/theme/theme-provider";

import { MotionLazy } from "src/components/animate/motion-lazy";
import { ProgressBar } from "src/components/progress-bar";
import { SettingsDrawer, SettingsProvider, defaultSettings } from "src/components/settings";
import { detectSettings } from "src/components/settings/server";

import { AuthProvider } from "src/auth/context/jwt";

// ----------------------------------------------------------------------

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: primary.main,
};

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const settings = CONFIG.isStaticExport ? defaultSettings : await detectSettings();

  return (
    <html lang="en" suppressHydrationWarning>

      <head>
        <script src="https://kit.fontawesome.com/f88423a809.js" crossOrigin="anonymous"></script>
      </head>

      <body>
        {getInitColorSchemeScript}

        <AuthProvider>
          <SettingsProvider settings={settings} caches={CONFIG.isStaticExport ? "localStorage" : "cookie"}>
            <ThemeProvider>
              <MotionLazy>
                <ProgressBar />
                <SettingsDrawer hidePresets hideDirection hideFont hideNavColor hideNavLayout />
                {children}
              </MotionLazy>
            </ThemeProvider>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
