import { DividerProps } from "@mui/material";
import type { Components, Theme } from "@mui/material/styles";

// ----------------------------------------------------------------------

declare module "@mui/material/Divider" {
  interface DividerOwnProps {
    dashed?: boolean;
  }
}

export const MuiDivider: Components<Theme>["MuiDivider"] = {
  /** **************************************
   * VARIANTS
   *************************************** */
  variants: [
    {
      props: (state: DividerProps) => state.dashed === true,
      style: {
        borderStyle: "dashed",
      },
    },
  ],
};

// ----------------------------------------------------------------------

export const divider = { MuiDivider };
