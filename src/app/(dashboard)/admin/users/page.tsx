'use client';

import {
  Box, Typography, Card, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Avatar,
} from '@mui/material';
import { formatDate } from '@/lib/utils';

const sampleUsers = [
  { _id: '1', name: 'John Doe', email: 'john@example.com', role: 'customer', isActive: true, createdAt: new Date() },
  { _id: '2', name: 'Admin User', email: 'admin@example.com', role: 'admin', isActive: true, createdAt: new Date() },
  { _id: '3', name: 'Jane Smith', email: 'jane@example.com', role: 'customer', isActive: false, createdAt: new Date() },
];

export default function AdminUsersPage() {
  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        Users
      </Typography>

      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Joined</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sampleUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                  {user.name}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip label={user.role} color={user.role === 'admin' ? 'primary' : 'default'} size="small" />
                </TableCell>
                <TableCell>
                  <Chip label={user.isActive ? 'Active' : 'Inactive'} color={user.isActive ? 'success' : 'default'} size="small" />
                </TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
