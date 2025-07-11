'use client';
import React from 'react';
import { Box, Toolbar } from '@mui/material';

const MainContent = ({ children }) => {
  return (
    <Box
      component="main"
      sx={{
        marginLeft: '240px', // match sidebar width
        p: 3,
        minHeight: '100vh',
        backgroundColor: '#fff',
      }}
    >
      <Toolbar /> {/* space for AppBar if needed */}
      {children}
    </Box>
  );
};

export default MainContent;
