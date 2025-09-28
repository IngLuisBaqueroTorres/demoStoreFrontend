import { IconButton, useTheme as useMuiTheme } from '@mui/material';
import { useTheme } from '../hooks/useTheme';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const ThemeSwitcher = () => {
  const { mode, toggleTheme } = useTheme();
  const muiTheme = useMuiTheme();

  return (
    <IconButton
      onClick={toggleTheme}
      color="inherit"
      sx={{
        // Estilo minimalista sin borde
        border: 'none',
        '&:hover': {
          // Glow suave al pasar el cursor
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          boxShadow: `0 0 8px 2px ${muiTheme.palette.primary.light}`,
        },
      }}
    >
      {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
};

export default ThemeSwitcher;