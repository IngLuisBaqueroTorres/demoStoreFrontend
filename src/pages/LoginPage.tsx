import {
  Grid,
  CssBaseline,
  Box,
} from "@mui/material";
import LoginForm from "../components/forms/LoginForm";
import LoginFeatures from "../components/layout/LoginFeatures";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { useTheme } from "../hooks/useTheme";

interface LoginPageProps {
  formSide?: "left" | "right";
}

const LoginPage = ({
  formSide = "right",
}: LoginPageProps) => {
  const { mode } = useTheme();

  const background = mode === 'light' 
    ? '#ffffff' 
    : 'radial-gradient(circle, #1a3836ff 0%, #0a1312ff 90%)';

  return (
    <>
      <CssBaseline />
      <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}>
        <ThemeSwitcher />
      </Box>
      <Grid  container sx={{ 
        height: "100vh", 
        width: "100vw", 
        margin: 0, 
        background: background, 
        color: mode === 'light' ? 'black' : 'white' 
      }}>
        {formSide === "left" ? (
          <>
            <LoginForm />
            <LoginFeatures />
          </>
        ) : (
          <>
            <LoginFeatures />
            <LoginForm />
          </>
        )}
      </Grid>
    </>
  );
};

export default LoginPage;
