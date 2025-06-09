import { autocompleteClasses } from "@mui/material/Autocomplete";
import { svgIconClasses } from "@mui/material/SvgIcon";

import type { Components, Theme } from "@mui/material/styles";
import { menuItem, paper, varAlpha } from "../../styles";
import { FAIcon } from "interface/components/fa-icon";

// ----------------------------------------------------------------------

const MuiAutocomplete: Components<Theme>["MuiAutocomplete"] = {
  /** **************************************
   * DEFAULT PROPS
   *************************************** */
  defaultProps: {
    popupIcon: <FAIcon icon="caret-down" fontSize="xs" />,
    clearIcon: <FAIcon icon="xmark" fontSize="xs" />,
  },

  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }) => ({
      [`& span.${autocompleteClasses.tag}`]: {
        ...theme.typography.subtitle2,
        height: 24,
        minWidth: 24,
        lineHeight: "24px",
        textAlign: "center",
        padding: theme.spacing(0, 0.75),
        color: theme.vars.palette.text.secondary,
        borderRadius: theme.shape.borderRadius,
        backgroundColor: varAlpha(theme.vars.palette.grey["500Channel"], 0.16),
      },
    }),
    paper: ({ theme }) => ({ ...paper({ theme, dropdown: true }) }),
    listbox: ({ theme }) => ({
      padding: 0,
      [`& .${autocompleteClasses.option}`]: { ...menuItem(theme) },
    }),
    endAdornment: { [`& .${svgIconClasses.root}`]: { width: 18, height: 18 } },
  },
};

// ----------------------------------------------------------------------

export const autocomplete = { MuiAutocomplete };
