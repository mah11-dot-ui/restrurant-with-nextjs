'use client';

import { Box, Typography, Card, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { formatCurrency, formatDate } from '@/lib/utils';

const sampleOrders = [
  { _id: '1', items: [{ name: 'Grilled Salmon', quantity: 2 }], totalAmount: 49.98, status: 'delivered', paymentStatus: 'paid', createdAt: new Date() },
  { _id: '2', items: [{ name: 'Beef Steak', quantity: 1 }], totalAmount: 32.99, status: 'preparing', paymentStatus: 'paid', createdAt: new Date(Date.now() - 86400000) },
];

export default function OrdersPage() {
  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        My Orders
      </Typography>

      {sampleOrders.length === 0 ? (
        <Typography color="text.secondary">No orders yet.</Typography>
      ) : (
        <TableContainer component={Card}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
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
                  <TableCell sx={{ fontWeight: 600 }}>#{order._id}</TableCell>
                  <TableCell>
                    {order.items.map((i) => `${i.name} x${i.quantity}`).join(', ')}
                  </TableCell>
                  <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                  <TableCell>
                    <Chip label={order.status} color={order.status === 'delivered' ? 'success' : 'warning'} size="small" />
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
      )}
    </Box>
  );
}
