'use client';

import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Button,
  Divider,
  TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/utils';
import { ROUTES } from '@/constants';

export default function CartPage() {
  const { items, totalItems, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  if (items.length === 0) {
    return (
      <Box sx={{ py: 8, textAlign: 'center', minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <Container maxWidth="sm">
          <ShoppingBagIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 3 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Looks like you haven&apos;t added anything to your cart yet.
          </Typography>
          <Button
            component={Link}
            href={ROUTES.MENU}
            variant="contained"
            size="large"
            startIcon={<ArrowBackIcon />}
          >
            Browse Menu
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ py: { xs: 4, md: 6 }, bgcolor: 'background.default', minHeight: '80vh' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Shopping Cart ({totalItems} items)
          </Typography>
          <Button color="error" onClick={clearCart} startIcon={<DeleteIcon />}>
            Clear Cart
          </Button>
        </Box>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card>
              {items.map((item, index) => (
                <Box key={item.menuItem._id}>
                  {index > 0 && <Divider />}
                  <Box sx={{ display: 'flex', p: 2, gap: 2 }}>
                    <CardMedia
                      component="img"
                      image={item.menuItem.images[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'}
                      alt={item.menuItem.name}
                      sx={{ width: 120, height: 120, borderRadius: 2, objectFit: 'cover', flexShrink: 0 }}
                    />
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {item.menuItem.name}
                          </Typography>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                            {formatCurrency(item.menuItem.price * item.quantity)}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {formatCurrency(item.menuItem.price)} each
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton size="small" onClick={() => updateQuantity(item.menuItem._id, item.quantity - 1)}>
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <TextField
                            value={item.quantity}
                            size="small"
                            slotProps={{ htmlInput: { sx: { textAlign: 'center', width: 40 } } }}
                            sx={{ width: 70 }}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              if (!isNaN(val)) updateQuantity(item.menuItem._id, val);
                            }}
                          />
                          <IconButton size="small" onClick={() => updateQuantity(item.menuItem._id, item.quantity + 1)}>
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        <IconButton color="error" onClick={() => removeItem(item.menuItem._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ position: 'sticky', top: 100 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Order Summary
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1" color="text.secondary">Subtotal</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{formatCurrency(subtotal)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1" color="text.secondary">Delivery Fee</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{formatCurrency(5.99)}</Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Total</Typography>
                  <Typography variant="h6" color="secondary.main" sx={{ fontWeight: 700 }}>
                    {formatCurrency(subtotal + 5.99)}
                  </Typography>
                </Box>

                <Button
                  component={isAuthenticated ? Link : Button}
                  href={isAuthenticated ? ROUTES.CHECKOUT : ROUTES.LOGIN}
                  variant="contained"
                  size="large"
                  fullWidth
                >
                  {isAuthenticated ? 'Proceed to Checkout' : 'Sign in to Checkout'}
                </Button>

                <Button
                  component={Link}
                  href={ROUTES.MENU}
                  variant="text"
                  fullWidth
                  sx={{ mt: 1 }}
                >
                  Continue Shopping
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
