'use client';

import {
  Box, Typography, Card, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Select, MenuItem, FormControl,
} from '@mui/material';
import { formatDate } from '@/lib/utils';

const sampleReservations = [
  { _id: '1', name: 'John Doe', guests: 4, date: new Date(), time: '19:00', status: 'confirmed' },
  { _id: '2', name: 'Jane Smith', guests: 2, date: new Date(Date.now() + 86400000), time: '20:00', status: 'pending' },
  { _id: '3', name: 'Bob Wilson', guests: 6, date: new Date(Date.now() - 86400000), time: '18:30', status: 'completed' },
];

export default function AdminReservationsPage() {
  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        All Reservations
      </Typography>

      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Guests</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sampleReservations.map((r) => (
              <TableRow key={r._id}>
                <TableCell sx={{ fontWeight: 600 }}>{r.name}</TableCell>
                <TableCell>{formatDate(r.date)}</TableCell>
                <TableCell>{r.time}</TableCell>
                <TableCell>{r.guests}</TableCell>
                <TableCell>
                  <FormControl size="small" sx={{ minWidth: 130 }}>
                    <Select value={r.status} onChange={() => {}}>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="confirmed">Confirmed</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
