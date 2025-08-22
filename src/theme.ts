import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Cor primária (azul padrão do MUI, pode personalizar)
    },
    secondary: {
      main: "#dc004e", // Cor secundária (vermelho, pode personalizar)
    },
    background: {
      default: "#f5f5f5", // Fundo claro para o dashboard
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2rem",
      fontWeight: 500,
    },
    h2: {
      fontSize: "1.5rem",
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none", // Remove uppercase padrão dos botões
          borderRadius: 8, // Bordas arredondadas
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: "16px", // Padding padrão para cards e tabelas
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)", // Sombra suave
        },
      },
    },
  },
});

export default theme;
