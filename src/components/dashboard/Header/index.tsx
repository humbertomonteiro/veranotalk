import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../config/firebaseConfig";
import FirebaseAuth from "../../../services/auth";
import { onAuthStateChanged } from "firebase/auth";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import styles from "./header.module.css";

function Header() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserEmail(user ? user.email : null);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      const auth = new FirebaseAuth();
      await auth.logout();
      console.log("Logout bem-sucedido");
      navigate("/login");
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <List className={styles.drawerList}>
      <ListItem component="li" onClick={() => navigate("/dashboard")}>
        <ListItemText primary="Usuários" />
      </ListItem>
      <ListItem component="li" onClick={() => navigate("/dashboard")}>
        <ListItemText primary="Estatísticas" />
      </ListItem>
      <ListItem component="li" onClick={handleLogout}>
        <ListItemText primary="Sair" />
      </ListItem>
    </List>
  );

  return (
    <AppBar
      position="static"
      className={styles.appBar}
      sx={{
        backgroundColor: "var(--primary-color)",
        color: "var(--secondary-color)",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" className={styles.title}>
          Verano Talk Admin
          <Typography variant="body2" className={styles.email}>
            {userEmail || "N/A"}
          </Typography>
        </Typography>
        <Button
          color="inherit"
          onClick={handleLogout}
          className={styles.logoutButton}
          sx={{ display: { xs: "none", sm: "block" } }}
        >
          Sair
        </Button>
        <IconButton
          color="inherit"
          edge="end"
          onClick={handleDrawerToggle}
          sx={{ display: { xs: "block", sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            backgroundColor: "var(--secondary-color)",
            color: "var(--primary-color)",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </AppBar>
  );
}

export default Header;
