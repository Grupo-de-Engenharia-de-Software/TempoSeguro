import { accordionClasses } from "@mui/material/Accordion";
import { accordionSummaryClasses } from "@mui/material/AccordionSummary";
import { typographyClasses } from "@mui/material/Typography";
import { type Components, type Theme, alpha } from "@mui/material/styles";

// ----------------------------------------------------------------------

const MuiAccordion: Components<Theme>["MuiAccordion"] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme, ownerState }) => ({
      backgroundColor: "transparent",
      [`&.${accordionClasses.expanded}`]: {
        borderRadius: ownerState.square ? 0 : theme.shape.borderRadius,
        backgroundColor: theme.palette.background.paper,
      },
      [`&.${accordionClasses.disabled}`]: {
        backgroundColor: "transparent",
      },
    }),
  },
  /** **************************************
   * VARIANTS
   *************************************** */
  variants: [
    {
      props: { variant: "outlined" },
      style: ({ theme }) => ({
        "&::before": {
          display: "none",
        },
        "&.Mui-expanded": {
          border: "1px solid",
          borderColor: alpha(theme.palette.grey[500], 0.2),
          boxShadow: "none",
          margin: 0,
        },
        "& .MuiAccordionSummary-root": {
          padding: theme.spacing(3),
        },
        "& .MuiAccordionSummary-content": {
          margin: 0,
        },
        "& .MuiAccordionSummary-content.Mui-expanded": {
          margin: 0,
        },
        "& .MuiAccordionDetails-root": {
          padding: theme.spacing(0, 3, 3, 3),
        },
        borderRadius: theme.shape.borderRadius * 2 + "px !important",
      }),
    },
    {
      props: { variant: "outlined", square: true },
      style: {
        borderRadius: "0 !important",
      },
    },
  ],
};

// ----------------------------------------------------------------------

const MuiAccordionSummary: Components<Theme>["MuiAccordionSummary"] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }) => ({
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
      [`&.${accordionSummaryClasses.disabled}`]: {
        opacity: 1,
        color: theme.palette.action.disabled,
        [`& .${typographyClasses.root}`]: {
          color: "inherit",
        },
      },
    }),
    expandIconWrapper: { color: "inherit" },
  },
};

// ----------------------------------------------------------------------

const MuiAccordionActions: Components<Theme>["MuiAccordionActions"] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }) => ({
      padding: theme.spacing(0, 3, 3, 3),
    }),
  },
};

// ----------------------------------------------------------------------

export const accordion = {
  MuiAccordion,
  MuiAccordionSummary,
  MuiAccordionActions,
};
