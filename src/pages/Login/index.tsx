import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../config/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import styles from "./Login.module.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      console.log("Tentando login com:", email);
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login bem-sucedido");
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Erro no login:", err.message, err.code);
      let errorMessage = "Erro ao fazer login. Verifique suas credenciais.";
      if (err.code === "auth/invalid-email") {
        errorMessage = "E-mail inválido.";
      } else if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        errorMessage = "E-mail ou senha incorretos.";
      } else if (err.code === "auth/too-many-requests") {
        errorMessage = "Muitas tentativas. Tente novamente mais tarde.";
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <Container maxWidth="sm" className={styles.container}>
      <Box className={styles.formBox}>
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="E-mail"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            variant="outlined"
            sx={{ height: 48, "& .MuiInputBase-root": { height: 48 } }} // Ajusta altura do TextField
          />
          <TextField
            label="Senha"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            variant="outlined"
            sx={{ height: 48, "& .MuiInputBase-root": { height: 48 } }} // Ajusta altura do TextField
          />
          {error && (
            <Typography color="error" className={styles.error}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            className={styles.button}
            sx={{ height: 48, padding: "0 16px" }} // Ajusta altura e padding do Button
          >
            {loading ? "Carregando..." : "Entrar"}
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default Login;
