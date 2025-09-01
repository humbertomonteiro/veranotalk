import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import { AttachMoney, CheckCircle, People, Update } from "@mui/icons-material";
import Loading from "../../shared/Loading";
import styles from "./statsCard.module.css";
import useCheckout from "../../../hooks/useCheckout";

function StatsCard() {
  const { loading, stats, lastUpdated, fetchStats } = useCheckout();

  if (stats === undefined) {
    return <div>Stats deram error</div>;
  }

  if (loading) return <Loading />;

  const statCards = [
    {
      title: "Valor Total",
      value: `R$ ${stats.totalValue.toFixed(2)}`,
      icon: <AttachMoney fontSize="large" />,
      description: "Valor total em checkouts aprovados",
      color: "#2e7d32",
    },
    {
      title: "Checkouts Aprovados",
      value: stats.totalApprovedCheckouts.toString(),
      icon: <CheckCircle fontSize="large" />,
      description: "Transações concluídas com sucesso",
      color: "#1976d2",
    },
    {
      title: "Participantes",
      value: stats.totalParticipantsInApproved.toString(),
      icon: <People fontSize="large" />,
      description: "Participantes com checkouts aprovados",
      color: "#ed6c02",
    },
  ];

  return (
    <Box className={styles.container}>
      <Box className={styles.header}>
        <Typography variant="h5" className={styles.title}>
          Visão Geral do Evento
        </Typography>
        <Box className={styles.headerActions}>
          {lastUpdated && (
            <Typography variant="caption" className={styles.lastUpdated}>
              Atualizado: {lastUpdated}
            </Typography>
          )}
          <Tooltip title="Atualizar dados">
            <IconButton onClick={fetchStats} size="small" color="primary">
              <Update />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Grid className={styles.gridContainer}>
        {statCards.map((card, index) => (
          <Grid key={index}>
            <Card className={styles.card} sx={{ padding: "1rem" }}>
              <CardContent className={styles.cardContent} sx={{ padding: 0 }}>
                <Box
                  className={styles.iconContainer}
                  sx={{ color: card.color }}
                >
                  {card.icon}
                </Box>
                <Box className={styles.textContainer}>
                  <Typography
                    className={styles.value}
                    sx={{ color: card.color, fontSize: "1.8rem" }}
                  >
                    {card.value}
                  </Typography>
                  <Typography variant="subtitle1" className={styles.title}>
                    {card.title}
                  </Typography>
                  <Typography variant="body2" className={styles.description}>
                    {card.description}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default StatsCard;
