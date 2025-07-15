'use client';
import React, { useState } from 'react';
import {
  Box,
  Drawer,
  Toolbar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  AppBar,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LogoutIcon from '@mui/icons-material/Logout';
import TrafficIcon from '@mui/icons-material/Traffic';
import SchoolIcon from '@mui/icons-material/School';

import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

interface SideBarProps {
  children: React.ReactNode;
}

const drawerWidth = 240;

const menuItems = [
  {
    key: 'profile',
    label: 'View Profile',
    icon: <AccountCircleIcon />,
    route: '/viewProfile',
  },
  {
    key: 'open',
    label: 'Traffic Management',
    icon: <TrafficIcon />,
    route: '/trafficManagement',
  },
  {
    key: 'Information',
    label: 'Detail Information',
    icon: <OpenInNewIcon />,
    route: '/infoPage',
  },
  {
    key: 'learn',
    label: 'Learn',
    icon: <SchoolIcon />,
    route: '/learnpage',
  },
  {
    key: 'logout',
    label: 'Logout',
    icon: <LogoutIcon />,
    route: '/',
  },
];

const SideBar: React.FC<SideBarProps> = ({ children }) => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleMenuClick = (key: string, route: string) => {
    if (key === 'logout') {
      localStorage.clear();
      window.dispatchEvent(new Event('auth-change'));
      toast.success('Logout successful');
    }

    window.dispatchEvent(new Event('auth-change'));

    setTimeout(() => {
      router.push(route);
    }, 500);

    if (isMobile) setMobileOpen(false);
  };

  const drawerContent = (
    <>
      <Toolbar />
      <List>
        {menuItems.map(({ key, label, icon, route }) => (
          <ListItemButton
            key={key}
            onClick={() => handleMenuClick(key, route)}
            sx={{
              my: 1.2,
              px: 2,
              py: 1.5,
              borderRadius: 3,
              transition: 'all 0.3s ease-in-out',
              alignItems: 'center',
              backgroundColor: 'transparent',
              '&:hover': {
                background: 'linear-gradient(90deg, #d7cce7 0%, #9aaed2 100%)',
                color: '#fff',
                transform: 'translateX(2px)',
                '& .MuiListItemIcon-root': {
                  color: '#fff',
                  transform: 'scale(1.05)',
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: 2.5,
                justifyContent: 'center',
                color: '#6a11cb',
                fontSize: 28,
                transition: 'all 0.3s ease-in-out',
                borderRadius: '50%',
                p: 1.3,
                background:
                  key === 'profile'
                    ? 'linear-gradient(135deg,#d1b99c,#d6ca94)'
                    : key === 'open'
                    ? 'linear-gradient(135deg,#8bacA1,#50769c)'
                    : key === 'Information'
                    ? 'linear-gradient(135deg,#924a3c,#dd2476)'
                    : key === 'learn'
                    ? 'linear-gradient(135deg,#575e61,#6683a0)'
                    : key === 'logout'
                    ? 'linear-gradient(135deg,#575e61,#6683a0)'
                    : undefined,
              }}
            >
              {icon}
            </ListItemIcon>
            <ListItemText
              primary={label}
              primaryTypographyProps={{
                noWrap: true,
                sx: {
                  fontFamily: `'Georgia', 'Times New Roman', serif`,
                  fontSize: '1rem',
                  fontWeight: 500,
                  letterSpacing: '0.5px',
                  ml: 1,
                  color: 'inherit',
                  transition: 'color 0.3s ease-in-out',
                  display: {
                    sm: 'block',
                  },
                },
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div">
            My App
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Responsive drawer */}
      <Box component="nav">
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              [`& .MuiDrawer-paper`]: {
                width: drawerWidth,
                boxSizing: 'border-box',
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            {drawerContent}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: {
                width: drawerWidth,
                boxSizing: 'border-box',
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            {drawerContent}
          </Drawer>
        )}
      </Box>

      {/* Main content */}
{children && (
  <Box
    component="main"
    sx={{
      flexGrow: 1,
      p: 3,
      mt: 8, // Push content below AppBar
    }}
  >
    {children}
  </Box>
)}

    </Box>
  );
};

export default SideBar;
