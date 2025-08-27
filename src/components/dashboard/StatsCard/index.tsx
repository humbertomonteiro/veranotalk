import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  AttachMoney,
  CheckCircle,
  People,
  // Receipt,
  // EventAvailable,
  Update,
  // TrendingUp,
  // Payment,
} from "@mui/icons-material";
import { DashboardService } from "../../../services/dashboard";
import Loading from "../../shared/Loading";
import styles from "./statsCard.module.css";

function StatsCard() {
  const [stats, setStats] = useState({
    totalValue: 0,
    totalApprovedCheckouts: 0,
    totalParticipantsInApproved: 0,
    totalParticipants: 0,
    pendingCheckouts: 0,
    checkedInParticipants: 0,
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const dashboardService = new DashboardService();
      const statsData = await dashboardService.getStats();
      setStats(statsData as any);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Erro ao buscar estatísticas:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  const statCards = [
    {
      title: "Valor Total",
      value: `R$ ${stats.totalValue.toFixed(2)}`,
      icon: <AttachMoney fontSize="large" />,
      description: "Valor total em checkouts aprovados",
      color: "#2e7d32",
      // bgColor: "#edf7ed",
    },
    {
      title: "Checkouts Aprovados",
      value: stats.totalApprovedCheckouts.toString(),
      icon: <CheckCircle fontSize="large" />,
      description: "Transações concluídas com sucesso",
      color: "#1976d2",
      // bgColor: "#e8f4fd",
    },
    {
      title: "Participantes",
      value: stats.totalParticipantsInApproved.toString(),
      icon: <People fontSize="large" />,
      description: "Participantes com checkouts aprovados",
      color: "#ed6c02",
      // bgColor: "#fff4e5",
    },
    // {
    //   title: "Total de Inscrições",
    //   value: stats.totalParticipants?.toString() || "0",
    //   icon: <Receipt fontSize="large" />,
    //   description: "Total de inscrições realizadas",
    //   color: "#9c27b0",
    //   bgColor: "#f5eef8",
    // },
    // {
    //   title: "Check-ins Realizados",
    //   value: stats.checkedInParticipants?.toString() || "0",
    //   icon: <EventAvailable fontSize="large" />,
    //   description: "Participantes que fizeram check-in",
    //   color: "#d32f2f",
    //   bgColor: "#fdeaea",
    // },
    // {
    //   title: "Checkouts Pendentes",
    //   value: stats.pendingCheckouts?.toString() || "0",
    //   icon: <Payment fontSize="large" />,
    //   description: "Transações aguardando aprovação",
    //   color: "#7b1fa2",
    //   bgColor: "#f3e5f5",
    // },
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
            <Card
              className={styles.card}
              // sx={{ backgroundColor: card.bgColor }}
              elevation={2}
            >
              <CardContent className={styles.cardContent}>
                <Box
                  className={styles.iconContainer}
                  sx={{ color: card.color }}
                >
                  {card.icon}
                </Box>
                <Box className={styles.textContainer}>
                  <Typography
                    variant="h4"
                    className={styles.value}
                    sx={{ color: card.color }}
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

      {/* Cards adicionais de tendências ou comparações */}
      {/* <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid>
          <Card className={styles.trendCard} elevation={1}>
            <CardContent className={styles.trendContent}>
              <Box className={styles.trendHeader}>
                <TrendingUp color="primary" />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Taxa de Conversão
                </Typography>
              </Box>
              <Typography variant="h4" className={styles.trendValue}>
                {stats.totalParticipants > 0
                  ? `${(
                      (stats.totalApprovedCheckouts / stats.totalParticipants) *
                      100
                    ).toFixed(1)}%`
                  : "0%"}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Inscrições convertidas em checkouts aprovados
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid>
          <Card className={styles.trendCard} elevation={1}>
            <CardContent className={styles.trendContent}>
              <Box className={styles.trendHeader}>
                <EventAvailable color="primary" />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Taxa de Check-in
                </Typography>
              </Box>
              <Typography variant="h4" className={styles.trendValue}>
                {stats.totalParticipantsInApproved > 0
                  ? `${(
                      (stats.checkedInParticipants /
                        stats.totalParticipantsInApproved) *
                      100
                    ).toFixed(1)}%`
                  : "0%"}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Participantes que compareceram ao evento
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid> */}
    </Box>
  );
}

export default StatsCard;
