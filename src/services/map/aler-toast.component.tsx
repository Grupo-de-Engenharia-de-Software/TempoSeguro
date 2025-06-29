import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Box, Button, Card, Typography } from "@mui/material";
import toast from "react-hot-toast";

const AlertToast = ({ id, km }: { id: string; km: number }) => (
  <Card
    sx={{
      display: "flex",
      alignItems: "center",
      backgroundColor: "error.main",
      color: "common.white",
      p: 2,
      borderRadius: 2,
      boxShadow: 4,
      minWidth: 300,
    }}
  >
    <WarningAmberIcon fontSize="large" sx={{ mr: 2 }} />

    <Box sx={{ flex: 1 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
        Atenção!
      </Typography>
      <Typography variant="body2">Alerta a menos de {km} km de distância.</Typography>
    </Box>

    <Button
      onClick={() => toast.remove(id)}
      variant="outlined"
      sx={{
        borderColor: "common.white",
        color: "common.white",
        textTransform: "none",
      }}
    >
      Fechar
    </Button>
  </Card>
);

export const toastAlert = (km: number) => {
  toast.custom((t) => <AlertToast id={t.id} km={km} />, {
    duration: Infinity,
    removeDelay: 0,
    
  });
};
