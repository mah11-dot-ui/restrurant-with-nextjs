'use client';

import {
  Box, Typography, Card, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Select, MenuItem, FormControl,
} from '@mui/material';
import { formatCurrency, formatDate } from '@/lib/utils';

const sampleOrders = [
  { _id: 'ORD-001', user: { name: 'John Doe' }, items: ['Grilled Salmon x2'], totalAmount: 49.98, status: 'pending', paymentStatus: 'paid', createdAt: new Date() },
  { _id: 'ORD-002', user: { name: 'Jane Smith' }, items: ['Beef Steak x1'], totalAmount: 32.99, status: 'preparing', paymentStatus: 'paid', createdAt: new Date(Date.now() - 3600000) },
  { _id: 'ORD-003', user: { name: 'Bob Wilson' }, items: ['Pasta Carbonara x2'], totalAmount: 37.98, status: 'delivered', paymentStatus: 'paid', createdAt: new Date(Date.now() - 86400000) },
];

export default function AdminOrdersPage() {
  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        All Orders
      </Typography>

      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sampleOrders.map((order) => (
              <TableRow key={order._id}>
                <TableCell sx={{ fontWeight: 600 }}>{order._id}</TableCell>
                <TableCell>{order.user.name}</TableCell>
                <TableCell>{order.items.join(', ')}</TableCell>
                <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                <TableCell>
                  <FormControl size="small" sx={{ minWidth: 130 }}>
                    <Select value={order.status} onChange={() => {}}>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="confirmed">Confirmed</MenuItem>
                      <MenuItem value="preparing">Preparing</MenuItem>
                      <MenuItem value="ready">Ready</MenuItem>
                      <MenuItem value="delivered">Delivered</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <Chip label={order.paymentStatus} color={order.paymentStatus === 'paid' ? 'success' : 'default'} size="small" />
                </TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
