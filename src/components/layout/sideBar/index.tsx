'use client';
import React from 'react';
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
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LogoutIcon from '@mui/icons-material/Logout';

import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const drawerWidth = 240;

interface SideBarProps {
  setOpen?: (args: boolean) => void;
  open?: boolean;
  setPrevRoute?: (args: string) => void;
  children: React.ReactNode;
}

const menuItems = [
  {
    key: 'profile',
    label: 'View Profile',
    icon: <AccountCircleIcon />,
    route: '/viewProfile',
  },
  {
    key: 'open',
    label: 'View Details',
    icon: <OpenInNewIcon />,
    route: '/viewDetails',
  },
  {
    key: 'Information',
    label: 'Detail Information',
    icon: <OpenInNewIcon />,
    route: '/infoPage',
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

  const handleMenuClick = (key: string, route: string) => {
    window.dispatchEvent(new Event('auth-change'));

    if (key === 'logout') {
      localStorage.clear();
      toast.success('Logout successful');
    }

    setTimeout(() => {
      router.push(route);
    }, 1000);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            My App
          </Typography>
        </Toolbar>
      </AppBar>

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
        <Toolbar />
        <List>
          {menuItems.map(({ key, label, icon, route }) => (
            <ListItemButton key={key} onClick={() => handleMenuClick(key, route)}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default SideBar;
