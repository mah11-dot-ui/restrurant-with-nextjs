'use client';

import { useState } from 'react';
import {
  Box, Typography, Card, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Grid, MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatCurrency } from '@/lib/utils';

const sampleItems = [
  { _id: '1', name: 'Grilled Salmon', price: 24.99, category: { name: 'Main Course' }, isAvailable: true, isFeatured: true },
  { _id: '2', name: 'Beef Steak', price: 32.99, category: { name: 'Main Course' }, isAvailable: true, isFeatured: true },
  { _id: '3', name: 'Pasta Carbonara', price: 18.99, category: { name: 'Pasta' }, isAvailable: true, isFeatured: false },
];

export default function AdminMenuPage() {
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<typeof sampleItems[0] | null>(null);

  const handleOpen = (item?: typeof sampleItems[0]) => {
    setEditingItem(item || null);
    setOpen(true);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Menu Items
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
          Add Item
        </Button>
      </Box>

      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Available</TableCell>
              <TableCell>Featured</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sampleItems.map((item) => (
              <TableRow key={item._id}>
                <TableCell sx={{ fontWeight: 600 }}>{item.name}</TableCell>
                <TableCell>{item.category.name}</TableCell>
                <TableCell>{formatCurrency(item.price)}</TableCell>
                <TableCell>
                  <Chip label={item.isAvailable ? 'Yes' : 'No'} color={item.isAvailable ? 'success' : 'default'} size="small" />
                </TableCell>
                <TableCell>
                  <Chip label={item.isFeatured ? 'Yes' : 'No'} color={item.isFeatured ? 'primary' : 'default'} size="small" />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleOpen(item)}><EditIcon /></IconButton>
                  <IconButton size="small" color="error"><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Name" defaultValue={editingItem?.name || ''} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Price" type="number" defaultValue={editingItem?.price || ''} fullWidth />
            </Grid>
            <Grid size={12}>
              <TextField label="Description" multiline rows={3} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Category" select fullWidth defaultValue="">
                <MenuItem value="appetizers">Appetizers</MenuItem>
                <MenuItem value="main-course">Main Course</MenuItem>
                <MenuItem value="pasta">Pasta</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Preparation Time (min)" type="number" fullWidth />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpen(false)}>
            {editingItem ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
