import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../config/firebaseConfig";
import FirebaseAuth from "../../../services/auth";
import { onAuthStateChanged } from "firebase/auth";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import {
  Menu as MenuIcon,
  AccountCircle,
  ExitToApp,
  Settings,
} from "@mui/icons-material";
import styles from "./header.module.css";

interface HeaderProps {
  onMenuToggle: () => void;
}

function Header({ onMenuToggle }: HeaderProps) {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserEmail(user ? user.email : null);
      setUserName(user ? user.displayName || user.email : null);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      const authService = new FirebaseAuth();
      await authService.logout();
      console.log("Logout bem-sucedido");
      navigate("/login");
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    }
    handleCloseMenu();
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="fixed"
      className={styles.appBar}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "var(--primary-color)",
        color: "var(--secondary-color)",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        padding: "0",
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuToggle}
          className={styles.menuButton}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div" className={styles.title}>
          Verano Talk Admin
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="body2" className={styles.userInfo}>
            {userName || userEmail}
          </Typography>
          <IconButton
            color="inherit"
            onClick={handleProfileMenuOpen}
            size="large"
          >
            <AccountCircle />
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          keepMounted
        >
          <MenuItem onClick={handleCloseMenu}>
            <AccountCircle sx={{ mr: 1 }} /> Perfil
          </MenuItem>
          <MenuItem onClick={handleCloseMenu}>
            <Settings sx={{ mr: 1 }} /> Configurações
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ExitToApp sx={{ mr: 1 }} /> Sair
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
