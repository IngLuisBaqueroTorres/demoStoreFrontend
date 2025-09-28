import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Avatar,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import GoogleLogo from "../icons/GoogleLog"; // 👈 revisa que el archivo exista con este nombre
import { login } from "../../services/authService";
import { useTheme } from "../../hooks/useTheme";

// ✅ Esquema de validación unificado
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Correo inválido")
    .required("Correo requerido"),
  password: Yup.string().required("Contraseña requerida"),
  remember: Yup.boolean(),
});

// ✅ Tipado de las credenciales basado en el schema
export type LoginCredentials = Yup.InferType<typeof validationSchema>;

const LoginForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mode } = useTheme();

  return (
    <Grid
      item
      xs={12}
      md={6}
      sx={{
        flexBasis: { xs: "100%", md: "50%" },
        maxWidth: { xs: "100%", md: "50%" },
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 3,
      }}
    >
      <Card
        sx={{
          backgroundColor: "transparent",
          width: "100%",
          maxWidth: 400,
          p: 3,
          borderRadius: 3,
          boxShadow: 8,
          border: mode === 'light' ? '1px solid #ccc' : '1px solid #444',
        }}
      >
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
          }
          title={
            <Typography component="h1" variant="h6">
              {t("login.title", "Iniciar sesión")}
            </Typography>
          }
        />
        <CardContent>
          <Formik
            initialValues={{ email: "", password: "", remember: false }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const userData = await login(values);
                console.log("Login successful:", userData);

                if (userData?.token) {
                  localStorage.setItem("authToken", userData.token);
                  navigate("/dashboard");
                }
              } catch (error) {
                console.error("Fallo en el login:", error);
                // 👉 Aquí podrías mostrar un Snackbar o mensaje de error
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ errors, touched, getFieldProps }) => (
              <Form noValidate>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Correo electrónico"
                  autoComplete="email"
                  autoFocus
                  {...getFieldProps("email")}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Contraseña"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  {...getFieldProps("password")}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <FormControlLabel
                    control={<Field as={Checkbox} name="remember" color="primary" />}
                    label="Recordarme"
                    sx={{ color: 'text.secondary' }}
                  />
                  <Link href="#" variant="body2">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2
                  }}
                >
                  Iniciar sesión
                </Button>

                <Typography align="center" sx={{ mb: 2 }}>
                  ¿No tienes una cuenta?{" "}
                  <Link href="/register" variant="body2">
                    Regístrate
                  </Link>
                </Typography>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<GoogleLogo />}
                  sx={{
                    mb: 1,
                    borderColor: 'grey.500',
                    "&:hover": {
                      borderColor: 'primary.main',
                    },
                    textTransform: "none",
                    fontWeight: "bold",
                  }}
                  onClick={() => {
                    console.log("TODO: implementar login con Google");
                  }}
                >
                  Iniciar sesión con Google
                </Button>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default LoginForm;
