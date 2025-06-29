import { Box, ButtonBase, Dialog, Grid, Typography } from "@mui/material";
import { MapService } from "src/services/map/map.service";
import { ALERT_TYPES } from "../../services/map/alerts.data";

export const ModalAlerts = () => {
  const position = MapService.useStore((e) => e.addingPos);
  const onSave = MapService.useAddAlert();
  return (
    <Dialog
      onClose={() => MapService.useStore.setState({ addingPos: null })}
      open={Boolean(position)}
      maxWidth="sm"
      fullWidth
    >
      <Box sx={{ padding: 3 }}>
        <Grid container spacing={1} justifyContent="center">
          {ALERT_TYPES.map((alert) => {
            const { type, label, icon } = alert;
            return (
              <Grid size={{ sm: 3, xs: 4 }} key={type} display="flex" justifyContent="center">
                <ButtonBase
                  onClick={() => onSave(alert)}
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
                      color: alert.markerColor,
                    }}
                  >
                    <i className={`fa-solid ${icon}`} style={{ fontSize: 36 }} />
                    <Typography variant="caption" textAlign="center" sx={{ marginTop: 0.5 }}>
                      {label}
                    </Typography>
                  </Box>
                </ButtonBase>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Dialog>
  );
};
