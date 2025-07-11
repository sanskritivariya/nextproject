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
import TrafficIcon from '@mui/icons-material/Traffic';
import SchoolIcon from '@mui/icons-material/School';

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
    label: 'Trafic Management',
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
    label: 'learn',
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

const SideBar: React.FC<SideBarProps> = () => {
  const router = useRouter();

  const handleMenuClick = (key: string, route: string) => {
    window.dispatchEvent(new Event('auth-change'));

    if (key === 'logout') {
      localStorage.clear();
      window.dispatchEvent(new Event('auth-change'));
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

      {/* <Drawer
        variant="permanent"
        sx={{
          width: {
            xs: 60,
            sm: 140,
            md: 200,
            lg: 240,
          },
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: {
              xs: 60,
              sm: 140,
              md: 200,
              lg: 240,
            },
            boxSizing: 'border-box',
            backgroundColor: '#f5f5f5',
            overflowX: 'hidden',
          },
        }}
      > */}
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 240,
            boxSizing: 'border-box',
            backgroundColor: '#f5f5f5',
          },
        }}
      >
        <Toolbar />
        <List>
          {menuItems.map(({ key, label, icon, route }) => (
            <ListItemButton
              key={key}
              onClick={() => handleMenuClick(key, route)}
              sx={{
                my: 1,
                borderRadius: 2,
                transition: 'background 0.2s',
                '&:hover': {
                  background:
                    'linear-gradient(90deg,rgb(211, 199, 224) 0%,rgb(149, 170, 206) 100%)',
                  color: '#fff',
                  '& .MuiListItemIcon-root': {
                    color: '#fff',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: {
                    xs: 0,
                    sm: 2,
                  },
                  justifyContent: 'center',
                  color: '#6a11cb',
                  fontSize: 28,
                  transition: 'color 0.2s',
                  ...(key === 'profile' && {
                    background:
                      'linear-gradient(135deg,rgb(209, 185, 156) 0%,rgb(214, 202, 148) 100%)',
                    borderRadius: '50%',
                    p: 1,
                  }),
                  ...(key === 'open' && {
                    background:
                      'linear-gradient(135deg,rgb(139, 172, 161) 0%,rgb(80, 118, 156) 100%)',
                    borderRadius: '50%',
                    p: 1,
                  }),
                  ...(key === 'Information' && {
                    background:
                      'linear-gradient(135deg,rgb(146, 74, 60) 0%, #dd2476 100%)',
                    borderRadius: '50%',
                    p: 1,
                  }),
                  ...(key === 'learn' && {
                    background:
                      'linear-gradient(135deg,rgb(87, 94, 97) 0%,rgb(102, 131, 160) 100%)',
                    borderRadius: '50%',
                    p: 1,
                  }),
                  ...(key === 'logout' && {
                    background:
                      'linear-gradient(135deg,rgb(87, 94, 97) 0%,rgb(102, 131, 160) 100%)',
                    borderRadius: '50%',
                    p: 1,
                  }),
                }}
              >
                {icon}
              </ListItemIcon>
              <ListItemText
                primary={label}
                primaryTypographyProps={{
                  noWrap: true,
                  sx: {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: {
                      xs: 'none',
                      sm: 'block',
                    },
                    fontWeight: 600,
                    letterSpacing: 1,
                  },
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};

export default SideBar;
