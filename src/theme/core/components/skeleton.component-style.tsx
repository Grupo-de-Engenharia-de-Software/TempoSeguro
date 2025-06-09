import type { Components, Theme } from "@mui/material/styles";
import { varAlpha } from "../../styles";

// ----------------------------------------------------------------------

const MuiSkeleton: Components<Theme>["MuiSkeleton"] = {
  /** **************************************
   * DEFAULT PROPS
   *************************************** */
  defaultProps: { animation: "wave", variant: "rounded" },

  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }) => ({
      backgroundColor: varAlpha(theme.vars.palette.grey["400Channel"], 0.6),
    }),
    rounded: ({ theme }) => ({ borderRadius: theme.shape.borderRadius * 2 }),
  },
};

// ----------------------------------------------------------------------

export const skeleton = { MuiSkeleton };
