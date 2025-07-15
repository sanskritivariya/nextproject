'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Divider, Avatar } from '@mui/material';
import {
  getAuth,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { Grid } from '@mui/system';

interface UserData {
  name: string | null;
  email: string | null;
  image: string | null;
  uid: string;
}

const ViewProfile = () => {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser: FirebaseUser | null) => {
        console.log('firebaseUser', firebaseUser);
        if (firebaseUser) {
          console.log('firebaseUser', firebaseUser);
          const userData: UserData = {
            name: firebaseUser.displayName,
            email: firebaseUser.email,
            image: firebaseUser.photoURL,
            uid: firebaseUser.uid,
          };
          setUser(userData);
        } else {
          setUser(null);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  if (!user) {
    return <Typography variant="h6">Loading profile...</Typography>;
  }

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid>
        <Paper
          elevation={4}
          sx={{
            p: 6,
            borderRadius: 3,
            background:
              'linear-gradient(135deg,rgb(216, 225, 235) 0%, #e0e7ef 100%)',
          }}
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            textAlign="center"
          >
            <Avatar
              src={user.image || ''}
              sx={{ width: 100, height: 100, mb: 2 }}
            />
            <Typography variant="h5">
              {user.name || 'Name Unavailable'}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              {user.email}
            </Typography>
            <Divider sx={{ my: 2, borderColor: 'divider', width: '100%' }} />
            <Typography variant="caption">User ID: {user.uid}</Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ViewProfile;
