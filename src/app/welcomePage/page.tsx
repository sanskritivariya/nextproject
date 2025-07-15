'use client';

import React from 'react';
import { Box, Paper, Typography, useTheme, useMediaQuery } from '@mui/material';

const WelcomePage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f0f2f5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: '100%',
          maxWidth: 500,
          p: { xs: 3, sm: 4, md: 6 },
          borderRadius: 3,
          background:
            'linear-gradient(135deg, rgb(216, 225, 235) 0%, #e0e7ef 100%)',
          textAlign: 'center',
        }}
      >
        <Typography
          variant={isMobile ? 'h4' : 'h3'}
          fontWeight={700}
          gutterBottom
        >
          Welcome
        </Typography>
        <Typography variant={isMobile ? 'body1' : 'h6'} color="text.secondary">
          We're glad to have you here. Start exploring the app!
        </Typography>
      </Paper>
    </Box>
  );
};

export default WelcomePage;
