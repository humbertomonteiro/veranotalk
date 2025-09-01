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
import useUser from "../../hooks/useUser";
import CouponManagement from "../../components/dashboard/CouponManagement";

export type DashboardTab =
  | "dashboard"
  | "manual-checkout"
  | "credentialing"
  | "user-management"
  | "coupon-management";

function Dashboard() {
  const { user } = useUser();
  const [currentTab, setCurrentTab] = useState<DashboardTab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuToggle = () => {
    setSidebarOpen((prev) => !prev);
  };

  const renderContent = () => {
    switch (currentTab) {
      case "dashboard":
        return (
          <>
            {user?.permissions.includes("view_stats_cards") && <StatsCard />}
            <ParticipantList />
          </>
        );
      case "manual-checkout":
        return <ManualCheckout />;
      case "credentialing":
        return <Credentialing />;
      case "user-management":
        return <UserManagement />;
      case "coupon-management":
        return <CouponManagement />;
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
      <Header onMenuToggle={handleMenuToggle} />
      <Box className={styles.mainContainer}>
        <Sidebar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          isOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
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
