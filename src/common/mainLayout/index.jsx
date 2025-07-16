'use client';

import React from 'react';
import { Box, Toolbar, useTheme, useMediaQuery } from '@mui/material';

const MainContent = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      component="main"
      sx={{
        marginLeft: isMobile ? 0 : isTablet ? '200px' : '240px',
        p: {
          xs: 2,
          sm: 3,
          md: 4,
        },
        height: '100vh', // ✅ Important for consistent scroll container
        overflowY: 'auto', // ✅ Enables vertical scrolling
        overflowX: 'hidden',
        backgroundColor: '#fff',
        transition: 'margin 0.3s ease, padding 0.3s ease',
        display: 'flex',
        flexDirection: 'column', // ✅ Helps children flow top to bottom
      }}
    >
      <Toolbar />
      <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 1, py: 2 }}>
        {children}
      </Box>{' '}
      {/* <- This is important */}
    </Box>
  );
};

export default MainContent;
