import type { Components, Theme } from "@mui/material/styles";

// ----------------------------------------------------------------------

const MuiListItemIcon: Components<Theme>["MuiListItemIcon"] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }) => ({
      color: "inherit",
      // minWidth: 'auto', <----- Minimal default,
      minWidth: "0px !important",
      marginRight: theme.spacing(1),
    }),
  },
};

// ----------------------------------------------------------------------

const MuiListItemAvatar: Components<Theme>["MuiListItemAvatar"] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }) => ({ minWidth: "auto", marginRight: theme.spacing(1) }),
  },
};

// ----------------------------------------------------------------------

const MuiListItemText: Components<Theme>["MuiListItemText"] = {
  /** **************************************
   * DEFAULT PROPS
   *************************************** */
  defaultProps: {
    // primaryTypographyProps: { typography: 'subtitle2' }
  },

  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: { root: { margin: 0 }, multiline: { margin: 0 } },
};

// ----------------------------------------------------------------------

export const list = {
  MuiListItemIcon,
  MuiListItemAvatar,
  MuiListItemText,
};
