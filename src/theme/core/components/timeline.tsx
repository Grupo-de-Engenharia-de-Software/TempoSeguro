import type { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

const MuiTimelineDot: Record<string, any> = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: { root: { boxShadow: 'none' } },
};

const MuiTimelineConnector: Record<string, any> = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: { root: ({ theme }: { theme: Theme }) => ({ backgroundColor: theme.vars.palette.divider }) },
};

// ----------------------------------------------------------------------

export const timeline = { MuiTimelineDot, MuiTimelineConnector };
