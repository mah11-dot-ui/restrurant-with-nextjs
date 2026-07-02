'use client';

import { Box, Typography, Card, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { formatDate } from '@/lib/utils';

const sampleReservations = [
  { _id: '1', date: new Date(), time: '19:00', guests: 4, status: 'confirmed' },
  { _id: '2', date: new Date(Date.now() + 86400000 * 2), time: '20:00', guests: 2, status: 'pending' },
];

export default function ReservationsPage() {
  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        My Reservations
      </Typography>

      {sampleReservations.length === 0 ? (
        <Typography color="text.secondary">No reservations yet.</Typography>
      ) : (
        <TableContainer component={Card}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Guests</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sampleReservations.map((r) => (
                <TableRow key={r._id}>
                  <TableCell>{formatDate(r.date)}</TableCell>
                  <TableCell>{r.time}</TableCell>
                  <TableCell>{r.guests}</TableCell>
                  <TableCell>
                    <Chip label={r.status} color={r.status === 'confirmed' ? 'success' : 'warning'} size="small" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
