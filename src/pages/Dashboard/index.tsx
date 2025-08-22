import { Container, Box } from "@mui/material";
import Header from "../../components/dashboard/Header";
import StatsCard from "../../components/dashboard/StatsCard";
import ParticipantList from "../../components/dashboard/ParticipantList";
import styles from "./dashboard.module.css";

function Dashboard() {
  return (
    <Box className={styles.container}>
      <Header />
      <Container maxWidth="lg" className={styles.main}>
        <StatsCard />
        <ParticipantList />
      </Container>
    </Box>
  );
}

export default Dashboard;
