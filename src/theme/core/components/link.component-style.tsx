import type { Components, Theme } from "@mui/material/styles";

// ----------------------------------------------------------------------

const MuiLink: Components<Theme>["MuiLink"] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: {
      "&:not(:hover)": {
        textDecoration: "none"
      }
    }
  },
};

// ----------------------------------------------------------------------

export const link = { MuiLink };
