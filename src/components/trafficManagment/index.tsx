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
    <Box sx={{ p: { xs: 2, md: 4 } }}>
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
                        <Link href={`/signal/${signal.id}`} passHref>
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
                maxHeight: 'calc(100vh - 200px)', // adjust as needed based on header height
                overflowY: 'auto',
                pr: 1, // optional padding for scrollbar spacing
              }}
            >
              <Stack spacing={2}>
                {signals.map((signal) => (
                  <Card key={signal.id} variant="outlined">
                    <CardContent>
                      <Typography variant="h6">{signal.name}</Typography>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        City: <strong>{signal.city}</strong>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        State: <strong>{signal.state}</strong>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Roads: <strong>{signal.roads}-way</strong>
                      </Typography>
                      <Box mt={2}>
                        <Link href={`/signal/${signal.id}`} passHref>
                          <Button variant="contained" size="small" fullWidth>
                            View
                          </Button>
                        </Link>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
