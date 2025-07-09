'use client';

import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/navigation';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, database } from '../../../../firebase';

// Validation Schema
const SignupSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  name: Yup.string().required('Name is required'),
});

// Styled Background Image Box
const ImageBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  backgroundImage:
    'url(https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const Signup: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f5f5',
        px: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          maxWidth: 1000,
          width: '100%',
          height: { xs: 'auto', md: 600 },
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <Box sx={{ flex: 1 }}>
          <ImageBox />
        </Box>

        <Box
          sx={{
            flex: 1,
            p: { xs: 4, md: 6 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}
          >
            Sign Up
          </Typography>

          <Formik
            initialValues={{ email: '', password: '', name: '' }}
            validationSchema={SignupSchema}
            onSubmit={async (values, { setSubmitting }) => {
              setLoading(true);
              setError(null);
              setSuccess(false);

              try {
                const userCred = await createUserWithEmailAndPassword(
                  auth,
                  values.email,
                  values.password
                );

                const user = userCred.user;

                // Write to Realtime Database
                await set(ref(database, `users/${user.uid}`), {
                  uid: user.uid,
                  email: user.email,
                  name: values.name,
                  createdAt: new Date().toISOString(),
                });

                setSuccess(true);
                router.push('/');
              } catch (err: any) {
                setError(err.message);
              } finally {
                setLoading(false);
                setSubmitting(false);
              }
            }}
          >
            {({
              isSubmitting,
              handleChange,
              handleBlur,
              values,
              touched,
              errors,
            }) => (
              <Form>
                <TextField
                  fullWidth
                  margin="normal"
                  id="name"
                  name="name"
                  label="Full Name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />

                <TextField
                  fullWidth
                  margin="normal"
                  id="email"
                  name="email"
                  label="Email Address"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />

                <TextField
                  fullWidth
                  margin="normal"
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 600 }}
                  disabled={loading || isSubmitting}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  {loading ? 'Signing up...' : 'Sign Up'}
                </Button>

                {error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                )}

                {success && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    Signup successful! Redirecting...
                  </Alert>
                )}

                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                  Already have an account?{' '}
                  <Button variant="text" onClick={() => router.push('/')}>
                    Login Page
                  </Button>
                </Typography>
              </Form>
            )}
          </Formik>
        </Box>
      </Paper>
    </Box>
  );
};

export default Signup;
