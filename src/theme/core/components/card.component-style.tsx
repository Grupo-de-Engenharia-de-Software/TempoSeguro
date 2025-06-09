import type { Components, Theme } from "@mui/material/styles";

// ----------------------------------------------------------------------

const MuiCard: Components<Theme>["MuiCard"] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }) => ({
      position: "relative",
      boxShadow: theme.customShadows.card,
      borderRadius: theme.shape.borderRadius * 2,
      zIndex: 0, // Fix Safari overflow: hidden with border radius
    }),
  },
};

// ----------------------------------------------------------------------

const MuiCardHeader: Components<Theme>["MuiCardHeader"] = {
  /** **************************************
   * DEFAULT PROPS
   *************************************** */
  defaultProps: {
    titleTypographyProps: { variant: "h6" },
    subheaderTypographyProps: {
      variant: "body2",
      marginTop: 0, // Minimal default is '4px'
    },
  },

  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }) => ({
      padding: theme.spacing(3, 3, 0),
    }),
    action: {
      margin: 0,
    }
  },
};

// ----------------------------------------------------------------------

const MuiCardContent: Components<Theme>["MuiCardContent"] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: { root: ({ theme }) => ({ padding: theme.spacing(3) }) },
};

// ----------------------------------------------------------------------

export const card = { MuiCard, MuiCardHeader, MuiCardContent };
