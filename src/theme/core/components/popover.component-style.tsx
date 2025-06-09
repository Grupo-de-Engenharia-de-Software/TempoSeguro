import { listClasses } from "@mui/material/List";

import type { Components, Theme } from "@mui/material/styles";
import { paper } from "../../styles";

// ----------------------------------------------------------------------

const MuiPopover: Components<Theme>["MuiPopover"] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    paper: ({ theme }) => ({
      ...paper({ theme, dropdown: true }),
      [`& .${listClasses.root}`]: { paddingTop: 0, paddingBottom: 0 },
    }),
  },
};

// ----------------------------------------------------------------------

export const popover = { MuiPopover };
