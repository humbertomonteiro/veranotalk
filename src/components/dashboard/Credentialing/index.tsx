import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import { Badge, QrCode, CheckCircle } from "@mui/icons-material";

function Credentialing() {
  const [searchTerm, setSearchTerm] = useState("");

  // Dados de exemplo
  const participants = [
    {
      id: "1",
      name: "João Silva",
      email: "joao@email.com",
      document: "123.456.789-00",
      checkedIn: true,
    },
    {
      id: "2",
      name: "Maria Santos",
      email: "maria@email.com",
      document: "987.654.321-00",
      checkedIn: false,
    },
  ];

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Badge sx={{ mr: 1 }} />
        <Typography variant="h5">Credenciamento</Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Buscar Participante
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid>
            <TextField
              fullWidth
              label="CPF, E-mail ou Nome"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          <Grid>
            <Button fullWidth variant="contained" size="large">
              Buscar
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {participants.map((participant) => (
          <Grid key={participant.id}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">{participant.name}</Typography>
                  <Chip
                    icon={participant.checkedIn ? <CheckCircle /> : undefined}
                    label={
                      participant.checkedIn ? "Check-in Realizado" : "Pendente"
                    }
                    color={participant.checkedIn ? "success" : "default"}
                  />
                </Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {participant.email}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {participant.document}
                </Typography>
                <Button
                  fullWidth
                  variant={participant.checkedIn ? "outlined" : "contained"}
                  sx={{ mt: 2 }}
                  startIcon={<QrCode />}
                >
                  {participant.checkedIn ? "Ver Credencial" : "Fazer Check-in"}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Credentialing;
