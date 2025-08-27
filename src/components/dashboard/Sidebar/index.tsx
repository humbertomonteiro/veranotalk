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
import { Dashboard, PointOfSale, Badge, People } from "@mui/icons-material";
import { type DashboardTab } from "../../../pages/Dashboard";
import styles from "./sidebar.module.css";

interface SidebarProps {
  currentTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  isOpen: boolean;
}

function Sidebar({ currentTab, onTabChange, isOpen }: SidebarProps) {
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
      id: "credentialing" as DashboardTab,
      label: "Credenciamento",
      icon: <Badge />,
      requiredPermission: "manage_credentials",
    },
    {
      id: "user-management" as DashboardTab,
      label: "Gestão de Usuários",
      icon: <People />,
      requiredPermission: "manage_users",
    },
  ];

  // Em uma implementação real, isso viria do contexto de autenticação
  const userPermissions = [
    "view_dashboard",
    "create_checkout",
    "manage_credentials",
    "manage_users",
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    userPermissions.includes(item.requiredPermission)
  );

  const drawerContent = (
    <>
      <div className={styles.toolbar}>
        <div className={styles.logo}>Verano Admin</div>
      </div>
      <Divider />
      <List className={styles.menuList}>
        {filteredMenuItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={currentTab === item.id}
              onClick={() => onTabChange(item.id)}
              className={styles.menuItem}
            >
              <ListItemIcon className={styles.menuIcon}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={isOpen}
        onClose={() => onTabChange(currentTab)}
        ModalProps={{ keepMounted: true }}
        className={styles.drawer}
        classes={{ paper: styles.drawerPaper }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      open={isOpen}
      className={`${styles.drawer} ${
        isOpen ? styles.drawerOpen : styles.drawerClosed
      }`}
      classes={{
        paper: `${styles.drawerPaper} ${
          isOpen ? styles.drawerOpen : styles.drawerClosed
        }`,
      }}
    >
      {drawerContent}
    </Drawer>
  );
}

export default Sidebar;
