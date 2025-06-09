import { GlobalStyles, alpha } from "@mui/material";

export const ScrollBarStyle = (
  <GlobalStyles
    styles={(theme) => ({
      "*": {
        // scrollbarColor: ,
      },
      "*::-webkit-scrollbar": {
        width: 8,
        height: 8,
        [theme.breakpoints.down("sm")]: {
          display: "none",
        },
      },
      "*::-webkit-scrollbar-thumb": {
        background: alpha(theme.palette.grey[600], 0.48),
        border: "1px solid transparent",
        borderRadius: 12,
        backgroundClip: "padding-box",
      },
      "*::-webkit-scrollbar-track": {
        background: "transparent",
      },
      "*::-webkit-scrollbar-thumb:hover": {
        background: alpha(theme.palette.grey[600], 0.4),
        border: "1px solid transparent",
        borderRadius: 12,
        backgroundClip: "padding-box",
      },
      "body::-webkit-scrollbar-button:start": {
        height: 68,
      },
    })}
  />
);
