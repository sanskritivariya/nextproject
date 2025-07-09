'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Divider, Stack, Avatar } from '@mui/material';
import {
  getAuth,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';

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
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, margin: 'auto', mt: 5 }}>
      <Stack spacing={2} alignItems="center">
        <Avatar src={user.image || ''} sx={{ width: 100, height: 100 }} />
        <Typography variant="h5">{user.name || 'No name provided'}</Typography>
        <Typography color="text.secondary">{user.email}</Typography>
        <Divider sx={{ width: '100%' }} />
        <Typography variant="caption">User ID: {user.uid}</Typography>
      </Stack>
    </Paper>
  );
};

export default ViewProfile;
