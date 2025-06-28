import { Box, ButtonBase, Dialog, Grid, Typography } from "@mui/material";
import { FC } from "react";
import { ALERT_TYPES } from "./alerts.data";

interface ModalWarningsProps {
  position: [number, number] | null;
  handleClose: () => void;
  onSave: (type: string) => void;
}

export const ModalAlerts: FC<ModalWarningsProps> = ({ position, handleClose, onSave }) => {
  return (
    <Dialog onClose={handleClose} open={Boolean(position)} maxWidth="sm" fullWidth>
      <Box sx={{ padding: 3 }}>
        <Grid container spacing={1} justifyContent="center">
          {ALERT_TYPES.map(({ type, label, icon }) => (
            <Grid size={{ sm: 3, xs: 4 }} key={type} display="flex" justifyContent="center">
              <ButtonBase
                onClick={() => onSave(type)}
                sx={{
                  width: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.5,
                  borderRadius: 1,
                }}
              >
                <Box
                  sx={{
                    width: 1,
                    p: 2,
                    aspectRatio: "1 / 1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    color: "primary.main",
                  }}
                >
                  <i className={`fa-solid ${icon}`} style={{ fontSize: 36 }} />
                  <Typography variant="caption" textAlign="center" sx={{ marginTop: 0.5 }}>
                    {label}
                  </Typography>
                </Box>
              </ButtonBase>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Dialog>
  );
};
