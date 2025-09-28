
import {
  Box,
  Grid,
  Typography,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import BuildIcon from "@mui/icons-material/Build";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import { useTheme } from "../../hooks/useTheme";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface LoginFeaturesProps {
  features?: Feature[];
}

const LoginFeatures = ({
  features = [
    {
      icon: <SettingsIcon />,
      title: "Rendimiento adaptable",
      description:
        "Nuestro producto se adapta sin esfuerzo a sus necesidades, aumentando la eficiencia y simplificando sus tareas.",
    },
    {
      icon: <BuildIcon />,
      title: "Construido para durar",
      description:
        "Experimente una durabilidad inigualable que va más allá de una inversión duradera.",
    },
    {
      icon: <ThumbUpIcon />,
      title: "Gran experiencia de usuario",
      description:
        "Integre nuestro producto en su rutina con una interfaz intuitiva y fácil de usar.",
    },
    {
      icon: <RocketLaunchIcon />,
      title: "Funcionalidad innovadora",
      description:
        "Manténgase a la vanguardia con funciones que establecen nuevos estándares y abordan sus necesidades cambiantes.",
    },
  ],
}: LoginFeaturesProps) => {
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
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        p: 6,
      }}
    >
      <Box sx={{ maxWidth: 480 }}>
        <Typography variant="h4" sx={{ mb: 6, fontWeight: "bold" }}>
          Sitemark
        </Typography>
        {features.map((feature, index) => (
          <Box
            key={index}
            sx={{ display: "flex", alignItems: "flex-start", mb: 4 }}
          >
            <Box sx={{ mr: 2, color: "primary.main", fontSize: 28 }}>
              {feature.icon}
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                {feature.title}
              </Typography>
              <Typography variant="body2" color={mode === 'light' ? 'text.secondary' : 'grey.300'}>
                {feature.description}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Grid>
  );
};

export default LoginFeatures;
