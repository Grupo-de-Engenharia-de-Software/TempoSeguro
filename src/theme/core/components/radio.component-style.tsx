import { radioClasses } from "@mui/material/Radio";
import type { Components, Theme } from "@mui/material/styles";
import { FAIcon } from "interface/components/fa-icon";

// ----------------------------------------------------------------------


const MuiRadio: Components<Theme>["MuiRadio"] = {
  /** **************************************
   * DEFAULT PROPS
   *************************************** */
  defaultProps: {
    size: "small",
    icon: <FAIcon icon="circle" variant="regular" />,
    checkedIcon: <FAIcon icon="circle-dot" />,
  },

  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ ownerState, theme }) => ({
      padding: theme.spacing(1),
      ...(ownerState.color === "default" && {
        [`&.${radioClasses.checked}`]: {
          color: theme.vars.palette.text.primary,
        },
      }),
      [`&.${radioClasses.disabled}`]: {
        color: theme.vars.palette.action.disabled,
      },
    }),
  },
};

// ----------------------------------------------------------------------

export const radio = { MuiRadio };
