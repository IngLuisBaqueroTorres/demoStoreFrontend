import { createTheme } from '@mui/material/styles';

// Create a theme instance.
const theme = createTheme({
  palette: {
    mode: 'light', // Set the base mode to light
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: '#d32f2f',
    },
    // The rest of the background and text colors will use defaults from the light palette
  },
  components: {
    // Override AppBar and Drawer to be dark
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#0f1523', // The previous dark background
          color: '#ffffff', // Set text color to white for contrast
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#0f1523', // The previous dark background
          color: '#ffffff', // Set text color to white for contrast
        },
      },
    },
    // Ensure icons in the dark drawer are also white
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: '#ffffff',
        },
      },
    },
    // The default MuiTextField for light mode is fine, so we remove the complex override.
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          // This could be removed if not needed, but let's keep it for now
          color: 'inherit',
        },
      },
    },
  },
});

export default theme;
