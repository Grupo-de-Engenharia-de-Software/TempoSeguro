"use client";

import type { Breakpoint, CSSObject, SxProps, Theme } from "@mui/material/styles";
import type { NavSectionProps } from "src/components/nav-section";
import type { SettingsState } from "src/components/settings";

import { useMemo } from "react";

import { iconButtonClasses } from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";

import { useBoolean } from "src/hooks/use-boolean";
import { stylesMode, varAlpha } from "src/theme/styles";

import { bulletColor } from "src/components/nav-section";
import { useSettingsContext } from "src/components/settings";

import { layoutClasses } from "../classes";
import { _account } from "../config-nav-account";
import { navData as dashboardNavData } from "../config-nav-dashboard";
import { HeaderBase } from "../core/header-base";
import { LayoutSection } from "../core/layout-section";
import { Main } from "./main";

// ----------------------------------------------------------------------

export type DashboardLayoutProps = {
  sx?: SxProps<Theme>;
  children: React.ReactNode;
  data?: {
    nav?: NavSectionProps["data"];
  };
};

export function DashboardLayout({ sx, children, data }: DashboardLayoutProps) {
  const theme = useTheme();

  const mobileNavOpen = useBoolean();

  const settings = useSettingsContext();

  const navColorVars = useNavColorVars(theme, settings);

  const layoutQuery: Breakpoint = "lg";

  const navData = data?.nav ?? dashboardNavData;

  const isNavMini = settings.navLayout === "mini";

  const isNavHorizontal = settings.navLayout === "horizontal";

  const isNavVertical = isNavMini || settings.navLayout === "vertical";

  return (
    <>
      <LayoutSection
        /** **************************************
         * Header
         *************************************** */
        headerSection={
          <HeaderBase
            layoutQuery={layoutQuery}
            disableElevation={isNavVertical}
            onOpenNav={mobileNavOpen.onTrue}
            data={{
              nav: navData,
              account: _account,
            }}
            slotsDisplay={{
              signIn: false,
            }}
            slotProps={{
              toolbar: {
                sx: {
                  [`& [data-slot="logo"]`]: {
                    display: "none",
                  },
                  ...(isNavHorizontal && {
                    bgcolor: "var(--layout-nav-bg)",
                    [`& .${iconButtonClasses.root}`]: {
                      color: "var(--layout-nav-text-secondary-color)",
                    },
                    [theme.breakpoints.up(layoutQuery)]: {
                      height: "var(--layout-nav-horizontal-height)",
                    },
                    [`& [data-slot="workspaces"]`]: {
                      color: "var(--layout-nav-text-primary-color)",
                    },
                    [`& [data-slot="logo"]`]: {
                      display: "none",
                      [theme.breakpoints.up(layoutQuery)]: { display: "inline-flex" },
                    },
                    [`& [data-slot="divider"]`]: {
                      [theme.breakpoints.up(layoutQuery)]: {
                        display: "flex",
                      },
                    },
                  }),
                },
              },
              container: {
                maxWidth: false,
                sx: {
                  ...(isNavVertical && { px: { [layoutQuery]: 5 } }),
                },
              },
            }}
          />
        }
        /** **************************************
         * Footer
         *************************************** */
        footerSection={null}
        /** **************************************
         * Style
         *************************************** */
        cssVars={{
          ...navColorVars.layout,
          "--layout-transition-easing": "linear",
          "--layout-transition-duration": "120ms",
          "--layout-nav-mini-width": "88px",
          "--layout-nav-vertical-width": "300px",
          "--layout-nav-horizontal-height": "64px",
          "--layout-dashboard-content-pt": theme.spacing(1),
          "--layout-dashboard-content-pb": theme.spacing(8),
          "--layout-dashboard-content-px": theme.spacing(5),
        }}
        sx={{
          [`& .${layoutClasses.hasSidebar}`]: {
            [theme.breakpoints.up(layoutQuery)]: {
              transition: theme.transitions.create(["padding-left"], {
                easing: "var(--layout-transition-easing)",
                duration: "var(--layout-transition-duration)",
              }),
              pl: isNavMini ? "var(--layout-nav-mini-width)" : "var(--layout-nav-vertical-width)",
            },
          },
          ...sx,
        }}
      >
        <Main isNavHorizontal={isNavHorizontal}>{children}</Main>
      </LayoutSection>
    </>
  );
}

// ----------------------------------------------------------------------

function useNavColorVars(theme: Theme, settings: SettingsState): Record<"layout" | "section", CSSObject> {
  const {
    vars: { palette },
  } = theme;

  return useMemo(() => {
    switch (settings.navColor) {
      case "integrate":
        return {
          layout: {
            "--layout-nav-bg": palette.background.default,
            "--layout-nav-horizontal-bg": varAlpha(palette.background.defaultChannel, 0.8),
            "--layout-nav-border-color": varAlpha(palette.grey["500Channel"], 0.12),
            "--layout-nav-text-primary-color": palette.text.primary,
            "--layout-nav-text-secondary-color": palette.text.secondary,
            "--layout-nav-text-disabled-color": palette.text.disabled,
            [stylesMode.dark]: {
              "--layout-nav-border-color": varAlpha(palette.grey["500Channel"], 0.08),
              "--layout-nav-horizontal-bg": varAlpha(palette.background.defaultChannel, 0.96),
            },
          },
          section: {},
        };
      case "apparent":
        return {
          layout: {
            "--layout-nav-bg": palette.grey[900],
            "--layout-nav-horizontal-bg": varAlpha(palette.grey["900Channel"], 0.96),
            "--layout-nav-border-color": "transparent",
            "--layout-nav-text-primary-color": palette.common.white,
            "--layout-nav-text-secondary-color": palette.grey[500],
            "--layout-nav-text-disabled-color": palette.grey[600],
            [stylesMode.dark]: {
              "--layout-nav-bg": palette.grey[800],
              "--layout-nav-horizontal-bg": varAlpha(palette.grey["800Channel"], 0.8),
            },
          },
          section: {
            // caption
            "--nav-item-caption-color": palette.grey[600],
            // subheader
            "--nav-subheader-color": palette.grey[600],
            "--nav-subheader-hover-color": palette.common.white,
            // item
            "--nav-item-color": palette.grey[500],
            "--nav-item-root-active-color": palette.primary.light,
            "--nav-item-root-open-color": palette.common.white,
            // bullet
            "--nav-bullet-light-color": bulletColor.dark,
            // sub
            ...(settings.navLayout === "vertical" && {
              "--nav-item-sub-active-color": palette.common.white,
              "--nav-item-sub-open-color": palette.common.white,
            }),
          },
        };
      default:
        throw new Error(`Invalid color: ${settings.navColor}`);
    }
  }, [
    palette.background.default,
    palette.background.defaultChannel,
    palette.common.white,
    palette.grey,
    palette.primary.light,
    palette.text.disabled,
    palette.text.primary,
    palette.text.secondary,
    settings.navColor,
    settings.navLayout,
  ]);
}
