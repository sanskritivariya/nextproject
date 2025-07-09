'use client';

import React from 'react';
import { Grid, Typography, Paper, Box } from '@mui/material';

const WelcomePage: React.FC = () => {
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        height: '100vh',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
        bgcolor: '#f0f2f5',
      }}
    >
      {/* Grid item must be inside Grid container */}
      <Grid>
        <Paper
          elevation={4}
          sx={{
            p: 6,
            borderRadius: 3,
            background:
              'linear-gradient(135deg,rgb(166, 186, 206) 0%, #e0e7ef 100%)',
          }}
        >
          <Box textAlign="center">
            <Typography variant="h3" fontWeight={700} gutterBottom>
              Welcome
            </Typography>
            <Typography variant="h6" color="text.secondary">
              We're glad to have you here. Start exploring the app!
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default WelcomePage;
