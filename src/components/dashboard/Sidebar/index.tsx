import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Dashboard,
  PointOfSale,
  Badge,
  People,
  Discount,
} from "@mui/icons-material";
import { type DashboardTab } from "../../../pages/Dashboard";
import styles from "./sidebar.module.css";
import useUser from "../../../hooks/useUser";

interface SidebarProps {
  currentTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  isOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

function Sidebar({
  currentTab,
  onTabChange,
  isOpen,
  setSidebarOpen,
}: SidebarProps) {
  const { user } = useUser();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const menuItems = [
    {
      id: "dashboard" as DashboardTab,
      label: "Dashboard",
      icon: <Dashboard />,
      requiredPermission: "view_dashboard",
    },
    {
      id: "manual-checkout" as DashboardTab,
      label: "Checkout Manual",
      icon: <PointOfSale />,
      requiredPermission: "create_checkout",
    },
    {
      id: "user-management" as DashboardTab,
      label: "Gestão de Usuários",
      icon: <People />,
      requiredPermission: "manage_users",
    },
    {
      id: "coupon-management" as DashboardTab,
      label: "Gestão de Cupons",
      icon: <Discount />,
      requiredPermission: "manage_coupons",
    },
    {
      id: "credentialing" as DashboardTab,
      label: "Credenciamento",
      icon: <Badge />,
      requiredPermission: "manage_credentials",
    },
  ];

  const filteredMenuItems = menuItems.filter((item) => {
    if (!user) {
      console.log("Usuário não encontrado");
      return false;
    }
    return user.permissions.includes(item.requiredPermission);
  });

  const handleMenuItemClick = (tab: DashboardTab) => {
    onTabChange(tab);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const drawerContent = (
    <>
      <div className={styles.toolbar}>
        <div className={styles.logo}>Verano Admin</div>
      </div>
      <Divider />
      <List className={styles.menuList}>
        {filteredMenuItems.length === 0 ? (
          <ListItem>
            <ListItemText primary="Nenhum item de menu disponível" />
          </ListItem>
        ) : (
          filteredMenuItems.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                selected={currentTab === item.id}
                onClick={() => handleMenuItemClick(item.id)}
                className={styles.menuItem}
                aria-selected={currentTab === item.id}
              >
                <ListItemIcon className={styles.menuIcon}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))
        )}
      </List>
    </>
  );

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? isOpen : true}
      onClose={() => setSidebarOpen(false)}
      ModalProps={{ keepMounted: true }}
      className={styles.drawer}
      classes={{
        paper: styles.drawerPaper,
      }}
    >
      {drawerContent}
    </Drawer>
  );
}

export default Sidebar;
