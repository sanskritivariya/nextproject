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
  InputAdornment,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, database } from '../../../../firebase';

const SignupSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  name: Yup.string().required('Name is required'),
});

const MotionBox = motion(Box);

const Signup: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
        <MotionBox
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          sx={{
            flex: { xs: 'none', md: 1 },
            height: { xs: 200, md: '100%' },
            position: 'relative',
          }}
        >
          <Box
            component="img"
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=50"
            alt="Sign up background"
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 0.5s ease-in-out',
              display: 'block',
            }}
          />
          {!imageLoaded && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'loadingShimmer 1.2s infinite',
              }}
            />
          )}
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          sx={{
            flex: 1,
            p: { xs: 4, md: 6 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Typography component="h1" variant="h4" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
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
                const userCred = await createUserWithEmailAndPassword(auth, values.email, values.password);
                const user = userCred.user;
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
            {({ isSubmitting, handleChange, handleBlur, values, touched, errors }) => (
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
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
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

                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mt: 2 }}>Signup successful! Redirecting...</Alert>}

                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                  Already have an account?{' '}
                  <Button variant="text" onClick={() => router.push('/')}>Login Page</Button>
                </Typography>
              </Form>
            )}
          </Formik>
        </MotionBox>
      </Paper>
    </Box>
  );
};

export default Signup;