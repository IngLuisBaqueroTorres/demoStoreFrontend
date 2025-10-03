





import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { styled, useTheme as useMuiTheme } from '@mui/material/styles';
import type { CSSObject, Theme } from '@mui/material/styles';
import {
  Box,
  Typography,
  Toolbar,
  List,
  CssBaseline,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Grid,
  Menu,
  MenuItem,
  useMediaQuery,
} from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import type { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AccountCircle from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import SalesChart from '../components/charts/SalesChart';
import ThemeSwitcher from '../components/ThemeSwitcher';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

// Drawer SOLO para escritorio (mini variant)
const DesktopDrawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));
export default function DashboardPage() {
  const theme = useMuiTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const userName = "Usuario de Prueba";

  const [open, setOpen] = React.useState(!isMobile);
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);

  React.useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  const handleDrawerToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  // Drawer para móvil (temporary)
  const MobileDrawer = (
    <MuiDrawer
      variant="temporary"
      open={open}
      onClose={handleDrawerToggle}
      ModalProps={{
        keepMounted: true, // Mejor rendimiento en móviles
      }}
      sx={{
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          zIndex: theme.zIndex.drawer + 3,
        },
      }}
    >
      <DrawerHeader>
        <IconButton onClick={handleDrawerToggle}>
          {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton onClick={() => navigate('/dashboard')}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton onClick={() => navigate('/orders')}>
            <ListItemIcon>
              <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText primary="Orders" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton onClick={() => navigate('/customers')}>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Customers" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton onClick={logout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </MuiDrawer>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={!isMobile && open}>
        <Toolbar>
          {(!open || isMobile) && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              edge="start"
              sx={{ marginRight: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>

          <ThemeSwitcher />

          <IconButton onClick={handleMenu} color="inherit" sx={{ ml: 1 }}>
            <AccountCircle />
          </IconButton>

          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleCloseMenu}
          >
            <MenuItem onClick={logout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {isMobile ? (
        MobileDrawer
      ) : (
        <DesktopDrawer variant="permanent" open={open}>
          <DrawerHeader>
            {open && (
              <IconButton onClick={handleDrawerToggle}>
                {theme.direction === 'rtl' ? (
                  <ChevronRightIcon />
                ) : (
                  <ChevronLeftIcon />
                )}
              </IconButton>
            )}
          </DrawerHeader>
          <Divider />
          <List>
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{ justifyContent: open ? 'initial' : 'center' }}
                onClick={() => navigate('/dashboard')}
              >
                <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto' }}>
                  <DashboardIcon />
                </ListItemIcon>
                {open && <ListItemText primary="Dashboard" />}
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{ justifyContent: open ? 'initial' : 'center' }}
                onClick={() => navigate('/orders')}
              >
                <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto' }}>
                  <ShoppingCartIcon />
                </ListItemIcon>
                {open && <ListItemText primary="Orders" />}
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{ justifyContent: open ? 'initial' : 'center' }}
                onClick={() => navigate('/customers')}
              >
                <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto' }}>
                  <PeopleIcon />
                </ListItemIcon>
                {open && <ListItemText primary="Customers" />}
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{ justifyContent: open ? 'initial' : 'center' }}
                onClick={logout}
              >
                <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto' }}>
                  <LogoutIcon />
                </ListItemIcon>
                {open && <ListItemText primary="Logout" />}
              </ListItemButton>
            </ListItem>
          </List>
        </DesktopDrawer>
      )}

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
         <Grid container spacing={3}>
          
          <Grid item xs={12}>            
            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              component="h1"
              sx={{
                fontWeight: 600, // semibold
                color: theme.palette.mode === 'dark' ? '#f1f1f1' : 'text.primary',
              }}
            >
              ¡Bienvenido, {userName}!
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.mode === 'dark' ? '#a8a8a8' : 'text.secondary',
              }}
            >
              Aquí tienes un resumen de la actividad de tu tienda.
            </Typography>
          </Grid>          
          <Grid item xs={12}>
            <SalesChart /> 
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
