import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: '#d32f2f',
    },
    background: {
      default: '#0f1523',
      paper: '#fdfdfdff',
      input: '#2e2d2dff', 
    },
    text: {
      primary: '#ffffff',
      secondary: '#cccccc',
    },
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          color: 'inherit',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: ({ theme }) => ({
          '& .MuiInputBase-input': {
            color: theme.palette.text.primary,
          },
          '& .MuiInputLabel-root': {
            color: theme.palette.text.secondary,
          },
          '& .MuiOutlinedInput-root': {
            backgroundColor: theme.palette.background.input, 
            borderRadius: 8,
            '& fieldset': {
              borderColor: theme.palette.text.primary,
            },
            '&:hover fieldset': {
              borderColor: theme.palette.text.secondary,
            },
            '&.Mui-focused fieldset': {
              borderColor: theme.palette.primary.main,
            },
          },
        }),
      },
    },
  },
});

export default theme;
