'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Divider,
  Stack,
} from '@mui/material';
import Link from 'next/link';
import { collection, onSnapshot, getFirestore } from 'firebase/firestore';
import { app } from '../../../firebase';

interface Signal {
  id: string;
  name: string;
  city: string;
  state: string;
  roads: number;
}

export default function DashboardPage() {
  const [signals, setSignals] = useState<Signal[] | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const firestore = getFirestore(app);
    const unsubscribe = onSnapshot(
      collection(firestore, 'signals'),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Signal[];
        setSignals(data);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <Box
      sx={{
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          position: 'sticky', // ✅ Makes it stay fixed while scrolling
          top: 0, // ✅ Sticks to the top
          zIndex: 10, // ✅ Ensure it's above scroll content
          backgroundColor: 'white', // ✅ Prevents overlap issues
          py: 2,
          px: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'flex-start' : 'center',
            mb: 3,
            gap: 2,
          }}
        >
          <Typography variant="h5" fontWeight={700}>
            Traffic Signals
          </Typography>

          <Link href="/trafficManagement/signal" passHref>
            <Button variant="contained" color="primary">
              + Create Signal
            </Button>
          </Link>
        </Box>

        {signals === null ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : signals.length === 0 ? (
          <Typography>No signals found.</Typography>
        ) : (
          <>
            {!isMobile ? (
              // 🖥 Desktop/tablet: MUI Table
              <Paper elevation={3}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>City</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>State</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Roads</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>View</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {signals.map((signal) => (
                      <TableRow key={signal.id} hover>
                        <TableCell>{signal.name}</TableCell>
                        <TableCell>{signal.city}</TableCell>
                        <TableCell>{signal.state}</TableCell>
                        <TableCell>{signal.roads}-way</TableCell>
                        <TableCell>
                          <Link
                            href={`/trafficManagement/signal/${signal.id}`}
                            passHref
                          >
                            <Button size="small" variant="outlined">
                              View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            ) : (
              // 📱 Mobile: Card layout (no scroll)
              <Box
                sx={{
                  flexGrow: 1,
                  overflowY: 'auto',
                  px: 1,
                  py: 2,
                }}
              >
                <Box
                  sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    px: 1,
                    py: 2,
                  }}
                >
                  <Stack spacing={2} pb={4}>
                    {signals.length === 0 ? (
                      <Typography
                        variant="body1"
                        textAlign="center"
                        color="text.secondary"
                        mt={4}
                      >
                        No signals found.
                      </Typography>
                    ) : (
                      signals.map((signal) => (
                        <Card
                          key={signal.id}
                          sx={{
                            borderRadius: 2,
                            boxShadow: 2,
                            background: 'white',
                            px: 2,
                            py: 1,
                          }}
                        >
                          <CardContent sx={{ p: 0 }}>
                            <Typography
                              variant="subtitle1"
                              fontWeight={600}
                              gutterBottom
                            >
                              {signal.name}
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                              <b>City:</b> {signal.city}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <b>State:</b> {signal.state}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <b>Roads:</b> {signal.roads}-way
                            </Typography>

                            <Box mt={2}>
                              <Link
                                href={`/trafficManagement/signal/${signal.id}`}
                                passHref
                              >
                                <Button
                                  variant="contained"
                                  fullWidth
                                  size="small"
                                  sx={{
                                    borderRadius: 1,
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    background:
                                      'linear-gradient(135deg, #90caf9 0%, #42a5f5 100%)',
                                    '&:hover': {
                                      background:
                                        'linear-gradient(135deg, #64b5f6 0%, #2196f3 100%)',
                                    },
                                  }}
                                >
                                  View
                                </Button>
                              </Link>
                            </Box>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </Stack>
                </Box>
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}
