import { alertClasses } from "@mui/material/Alert";
import type { AlertProps } from "@mui/material/Alert";
import type { CSSObject, Components, Theme } from "@mui/material/styles";
import { stylesMode, varAlpha } from "../../styles";
import { FAIcon } from "interface/components/fa-icon";

// ----------------------------------------------------------------------

const COLORS = ["primary", "secondary", "info", "success", "warning", "error"] as const;
declare module "@mui/material/Alert" {
  interface AlertPropsColorOverrides {
    primary: true;
    secondary: true;
  }
}

type ColorType = (typeof COLORS)[number];

function styleColors(ownerState: AlertProps, styles: (val: ColorType) => CSSObject) {
  const colorState = ownerState.severity === "info" && !ownerState.color ? "primary" : ownerState.color;
  const severityState = ownerState.severity;
  const outputStyle = COLORS.reduce((acc, color) => {
    if ((colorState || severityState) === color) {
      acc = styles(color);
    }
    return acc;
  }, {});

  return outputStyle;
}

// ----------------------------------------------------------------------

const MuiAlert: Components<Theme>["MuiAlert"] = {
  /** **************************************
   * DEFAULT PROPS
   *************************************** */
  defaultProps: {
    iconMapping: {
      error: <FAIcon fontSize="medium" icon="circle-xmark" />,
      info: <FAIcon fontSize="medium" icon="circle-exclamation" />,
      success: <FAIcon fontSize="medium" icon="circle-check" />,
      warning: <FAIcon fontSize="medium" icon="triangle-exclamation" />,
    },
  },

  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    icon: { opacity: 1, flexShrink: 0 },
    /**
     * @variant standard
     */
    standard: ({ ownerState, theme }) => {
      const styled = {
        colors: styleColors(ownerState, (color) => ({
          color: theme.vars.palette[color].darker,
          backgroundColor: theme.vars.palette[color].lighter,
          [stylesMode.dark]: {
            color: theme.vars.palette[color].lighter,
            backgroundColor: theme.vars.palette[color].darker,
          },
          [`& .${alertClasses.icon}`]: {
            color: theme.vars.palette[color].main,
            [stylesMode.dark]: { color: theme.vars.palette[color].light },
          },
        })),
      };

      return { ...styled.colors };
    },
    /**
     * @variant filled
     */
    filled: ({ ownerState, theme }) => {
      const styled = {
        colors: styleColors(ownerState, (color) => ({
          color: theme.vars.palette[color].contrastText,
        })),
      };

      return { ...styled.colors };
    },
    /**
     * @variant outlined
     */
    outlined: ({ ownerState, theme }) => {
      const styled = {
        colors: styleColors(ownerState, (color) => ({
          backgroundColor: varAlpha(theme.vars.palette[color].mainChannel, 0.08),
          color: theme.vars.palette[color].dark,
          border: `solid 1px ${varAlpha(theme.vars.palette[color].mainChannel, 0.16)}`,
          [stylesMode.dark]: { color: theme.vars.palette[color].light },
          [`& .${alertClasses.icon}`]: {
            color: theme.vars.palette[color].main,
          },
        })),
      };

      return { ...styled.colors };
    },
  },
};

// ----------------------------------------------------------------------

const MuiAlertTitle: Components<Theme>["MuiAlertTitle"] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }) => ({
      marginBottom: theme.spacing(0.5),
      fontWeight: theme.typography.fontWeightSemiBold,
    }),
  },
};

// ----------------------------------------------------------------------

export const alert = { MuiAlert, MuiAlertTitle };
