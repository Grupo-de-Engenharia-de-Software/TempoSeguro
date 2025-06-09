import type { Components, Theme } from "@mui/material/styles";

// ----------------------------------------------------------------------

const MuiCssBaseline: Components<Theme>["MuiCssBaseline"] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: (theme) => ({
    "*": {
      boxSizing: "border-box",
    },
    html: {
      margin: 0,
      padding: 0,
      width: "100%",
      height: "100%",
      WebkitOverflowScrolling: "touch",
    },
    body: {
      margin: 0,
      padding: 0,
      width: "100%",
      height: "100%",
    },
    "#root, #__next": {
      width: "100%",
      minHeight: "100%",
      backgroundColor: theme.vars.palette.background.default,
    },
    input: {
      "&[type=number]": {
        MozAppearance: "textfield",
        "&::-webkit-outer-spin-button": {
          margin: 0,
          WebkitAppearance: "none",
        },
        "&::-webkit-inner-spin-button": {
          margin: 0,
          WebkitAppearance: "none",
        },
      },
    },
    img: {
      maxWidth: "100%",
      display: "inline-block",
      verticalAlign: "bottom",
    },
  }),
};

// ----------------------------------------------------------------------

export const cssBaseline = { MuiCssBaseline };
