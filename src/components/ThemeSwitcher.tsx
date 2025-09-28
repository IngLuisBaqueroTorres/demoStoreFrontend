
import { Switch, Box, FormControlLabel } from '@mui/material';
import { useTheme } from '../hooks/useTheme';
import { MaterialUISwitch } from './ui/Switch';

const ThemeSwitcher = () => {
  const { mode, toggleTheme } = useTheme();

  return (
    <Box>
      <FormControlLabel
        control={<MaterialUISwitch sx={{ m: 1 }} checked={mode === 'dark'} onChange={toggleTheme} />}
        label=""
      />
    </Box>
  );
};

export default ThemeSwitcher;
