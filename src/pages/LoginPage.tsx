import { Grid, CssBaseline, Box } from "@mui/material";
import LoginForm from "../components/forms/LoginForm";
import LoginFeatures from "../components/layout/LoginFeatures";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { useTheme } from "../hooks/useTheme";

interface LoginPageProps {
  formSide?: "left" | "right";
}

const LoginPage = ({ formSide = "right" }: LoginPageProps) => {
  const { mode } = useTheme();

  const background =
    mode === "light"
      ? "#ffffff"
      : "radial-gradient(circle, #1a3836ff 0%, #0a1312ff 90%)";

  return (
    <>
      <CssBaseline />
      <Box sx={{ position: "absolute", top: 16, right: 16, zIndex: 1 }}>
        <ThemeSwitcher />
      </Box>
     <Grid
  container
  sx={{
    minHeight: "100vh",        // ✅ Se ajusta al contenido si crece
    width: "100%",
    margin: 0,
    background: background,
    backgroundSize: "cover",   // ✅ Evita cortes
    backgroundAttachment: "fixed", // ✅ Fija el fondo en pantallas grandes
    color: mode === "light" ? "black" : "white",
    justifyContent: "center",
    alignItems: { xs: "flex-start", md: "center" }, // ✅ móvil arriba, desktop centrado
    overflowX: "hidden",
  }}
>
        <Grid
           container
  item
  xs={12}
  sm={11}
  md={10}
  lg={9}
  xl={8}   // opcional
  sx={{
    justifyContent: "center",
    alignItems: "center",
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    p: { xs: 1, sm: 2 },
  }}
        >
          {/* Columna de Features */}
          <Box
            sx={{
              display: { xs: 'none', sm: 'block' },
              boxSizing: 'border-box', // Asegura que el padding no desborde la columna
              p: 2,
              order: formSide === 'right' ? 1 : 2, // Controla el orden visual
              // Proporciones flexibles: 50/50 en 'sm', 7/5 en 'md'
              flex: { sm: 1, md: 6, lg: 7 },
            }}
          >
            <LoginFeatures />
          </Box>
          {/* Columna del Formulario */}
          <Box
            sx={{
              boxSizing: 'border-box', // Asegura que el padding no desborde la columna
              p: 2,
              order: formSide === 'right' ? 2 : 1,
              flex: { xs: 1, sm: 1, md: 4, lg: 5 }, // Ocupa todo en 'xs', 50/50 en 'sm', 5/7 en 'md'
            }}
          >
            <LoginForm />
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default LoginPage;
