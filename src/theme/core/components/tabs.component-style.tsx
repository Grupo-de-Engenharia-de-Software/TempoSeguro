import { tabClasses } from "@mui/material/Tab";
import type { Components, Theme } from "@mui/material/styles";

// ----------------------------------------------------------------------

const MuiTabs: Components<Theme>["MuiTabs"] = {
  /** **************************************
   * DEFAULT PROPS
   *************************************** */
  defaultProps: {
    textColor: "inherit",
    variant: "scrollable",
    allowScrollButtonsMobile: true,
  },

  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    flexContainer: ({ ownerState, theme }) => ({
      ...(ownerState.variant !== "fullWidth" && {
        gap: "24px",
        [theme.breakpoints.up("sm")]: {
          gap: "40px",
        },
      }),
    }),
    indicator: { backgroundColor: "currentColor" },
  },
};

// ----------------------------------------------------------------------

const MuiTab: Components<Theme>["MuiTab"] = {
  /** **************************************
   * DEFAULT PROPS
   *************************************** */
  defaultProps: { disableRipple: true, iconPosition: "start" },

  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }) => ({
      opacity: 1,
      gap: "4px",
      minWidth: 48,
      minHeight: 48,
      padding: theme.spacing(1, 0),
      color: theme.vars.palette.text.secondary,
      fontWeight: theme.typography.fontWeightSemiBold,
      lineHeight: theme.typography.body2.lineHeight,
      [`&.${tabClasses.selected}`]: {
        color: theme.vars.palette.text.primary,
      },
    }),
  },
};

// ----------------------------------------------------------------------

export const tabs = { MuiTabs, MuiTab };
