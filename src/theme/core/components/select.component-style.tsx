import type { Components, Theme } from "@mui/material/styles";
import { FAIcon } from "interface/components/fa-icon";

// ----------------------------------------------------------------------


const IconComponent = () => <FAIcon icon="caret-down" fontSize="xs" />


// ----------------------------------------------------------------------


const MuiSelect: Components<Theme>["MuiSelect"] = {
  /** **************************************
   * DEFAULT PROPS
   *************************************** */
  defaultProps: { IconComponent },

  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    icon: {
      right: 10,
      width: 18,
      height: 18,
      top: "calc(50% - 9px)",
    },
    filled: ({ ownerState }) => ({
      paddingTop: ownerState.size === "small" ? "4px !important" : "8px !important",
    }),
  },
};

// ----------------------------------------------------------------------

const MuiNativeSelect: Components<Theme>["MuiNativeSelect"] = {
  /** **************************************
   * DEFAULT PROPS
   *************************************** */
  defaultProps: { IconComponent },

  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    icon: {
      right: 10,
      width: 18,
      height: 18,
      top: "calc(50% - 9px)",
    },
  },
};

// ----------------------------------------------------------------------

export const select = { MuiSelect, MuiNativeSelect };
