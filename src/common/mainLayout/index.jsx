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
        marginLeft: isMobile ? 0 : isTablet ? '200px' : '240px', // dynamic sidebar width
        p: {
          xs: 2, // smaller padding for mobile
          sm: 3,
          md: 4,
        },
        minHeight: '100vh',
        overflow: 'hidden',
        backgroundColor: '#fff',
        transition: 'margin 0.3s ease, padding 0.3s ease',
      }}
    >
      <Toolbar /> {/* ensures spacing below AppBar */}
      {children}
    </Box>
  );
};

export default MainContent;
