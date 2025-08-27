import { useState } from "react";
import { Container, Box } from "@mui/material";
import Header from "../../components/dashboard/Header";
import Sidebar from "../../components/dashboard/Sidebar";
import StatsCard from "../../components/dashboard/StatsCard";
import ParticipantList from "../../components/dashboard/ParticipantList";
import ManualCheckout from "../../components/dashboard/ManualCheckout";
import Credentialing from "../../components/dashboard/Credentialing";
import UserManagement from "../../components/dashboard/UserManagement";
import styles from "./dashboard.module.css";

// Definição dos tipos de abas
export type DashboardTab =
  | "dashboard"
  | "manual-checkout"
  | "credentialing"
  | "user-management";

function Dashboard() {
  const [currentTab, setCurrentTab] = useState<DashboardTab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderContent = () => {
    switch (currentTab) {
      case "dashboard":
        return (
          <>
            <StatsCard />
            <ParticipantList />
          </>
        );
      case "manual-checkout":
        return <ManualCheckout />;
      case "credentialing":
        return <Credentialing />;
      case "user-management":
        return <UserManagement />;
      default:
        return (
          <>
            <StatsCard />
            <ParticipantList />
          </>
        );
    }
  };

  return (
    <Box className={styles.container}>
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <Box className={styles.mainContainer}>
        <Sidebar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          isOpen={sidebarOpen}
        />
        <Container
          className={`${styles.mainContent} ${
            sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
          }`}
        >
          {renderContent()}
        </Container>
      </Box>
    </Box>
  );
}

export default Dashboard;
