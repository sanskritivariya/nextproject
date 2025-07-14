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
import { LoginAPICALL } from '@/app/service/Login.service';


// Validation Schema
const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

// Styled Background Image Box
const ImageBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  backgroundImage:
    'url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  [theme.breakpoints.down('md')]: {
    display: 'none', // Hide on small screens
  },
}));

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
        {/* Left side image */}
        <Box sx={{ flex: 1 }}>
          <ImageBox />
        </Box>

        {/* Right side form */}
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
            Login
          </Typography>

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={async (values, { setSubmitting }) => {
              setLoading(true);
              setError(null);
              setSuccess(false);
              

              try {
                const data = await LoginAPICALL({
                  email: values.email,
                  password: values.password,
                });
                console.log('data', data);
                if (data?.token) {
                  setSuccess(true);
                  localStorage.setItem('token', data.token);
                    window.dispatchEvent(new Event('auth-change'));
                  // Optional: redirect or further handling
                } else {
                  setError('Invalid credentials.');
                }
              } catch (err:any) {
                setError(err);
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
                  id="email"
                  name="email"
                  label="Email Address"
                  autoComplete="email"
                  autoFocus
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
                  autoComplete="current-password"
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
                  {loading ? 'Logging in...' : 'Login'}
                </Button>

                {error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                )}

                {success && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    Login successful!
                  </Alert>
                )}
              </Form>
            )}
          </Formik>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
