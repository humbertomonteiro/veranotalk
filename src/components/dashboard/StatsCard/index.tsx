import { useState, useEffect } from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { DashboardService } from "../../../services/dashboard";
import Loading from "../../shared/Loading";
import styles from "./statsCard.module.css";

function StatsCard() {
  const [stats, setStats] = useState({
    totalValue: 0,
    totalApprovedCheckouts: 0,
    totalParticipantsInApproved: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log("Buscando estatísticas...");
        const dashboardService = new DashboardService();
        const statsData = await dashboardService.getStats();
        setStats(statsData);
        console.log("Estatísticas:", statsData);
      } catch (err) {
        console.error("Erro ao buscar estatísticas:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loading />;

  return (
    <Grid container spacing={2} className={styles.container}>
      <Card className={styles.card}>
        <CardContent>
          <Typography variant="h6" className={styles.title}>
            Valor Bruto (Approved)
          </Typography>
          <Typography variant="h4" className={styles.value}>
            R$ {stats.totalValue.toFixed(2)}
          </Typography>
        </CardContent>
      </Card>
      <Card className={styles.card}>
        <CardContent>
          <Typography variant="h6" className={styles.title}>
            Checkouts Aprovados
          </Typography>
          <Typography variant="h4" className={styles.value}>
            {stats.totalApprovedCheckouts}
          </Typography>
        </CardContent>
      </Card>
      <Card className={styles.card}>
        <CardContent>
          <Typography variant="h6" className={styles.title}>
            Participantes em Checkouts Aprovados
          </Typography>
          <Typography variant="h4" className={styles.value}>
            {stats.totalParticipantsInApproved}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}

export default StatsCard;
