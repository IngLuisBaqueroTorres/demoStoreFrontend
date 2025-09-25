import {
  Grid,
  CssBaseline,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import createTheme from "./../theme/theme";
import LoginForm from "../components/forms/LoginForm";
import LoginFeatures from "../components/layout/LoginFeatures";

interface LoginPageProps {
  formSide?: "left" | "right";
  background?: string;
}

const LoginPage = ({
  formSide = "right",
  background ="radial-gradient(circle, #1a3836ff 0%, #0a1312ff 90%)",
}: LoginPageProps) => {

  return (
    <ThemeProvider theme={createTheme} >
      <CssBaseline />
      <Grid  container sx={{ height: "100vh", width: "100vw", margin: 0, background: background }}>
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
    </ThemeProvider>
  );
};

export default LoginPage;
