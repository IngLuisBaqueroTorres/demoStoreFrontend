
import { useTranslation } from "react-i18next";
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
import GoogleLogo from "../icons/GoogleLog";

const LoginForm = () => {
  const { t } = useTranslation();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t("validation.emailInvalid", "Correo inválido"))
      .required(t("validation.emailRequired", "Correo requerido")),
    password: Yup.string().required(
      t("validation.passwordRequired", "Contraseña requerida")
    ),
  });

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
          border: "1px solid #444",
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
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                setSubmitting(false);
                alert(JSON.stringify(values, null, 2));
              }, 400);
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
                <Link href="#" variant="body2">
                  ¿Olvidaste tu contraseña?
                </Link>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Field as={Checkbox} name="remember" color="primary" />
                    }
                    label="Acuérdate de mí"
                  />
                </Box>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    backgroundColor: "#f5f5f5",
                    color: "#000000",
                    "&:hover": {
                      backgroundColor: "#e0e0e0",
                    },
                  }}
                >
                  Iniciar sesión
                </Button>
                <Typography align="center" sx={{ mb: 2 }}>
                  ¿No tienes una cuenta?{" "}
                  <Link href="#" variant="body2">
                    Regístrate
                  </Link>
                </Typography>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<GoogleLogo component="svg" />}
                  sx={{
                    mb: 1,
                    color: "#ffffff",
                    borderColor: "#ffffff",
                    "&:hover": {
                      borderColor: "#cccccc",
                      backgroundColor: "rgba(255,255,255,0.08)",
                    },
                    textTransform: "none",
                    fontWeight: "bold",
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
