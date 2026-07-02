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
  Rating,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/constants';

const sampleWishlist = [
  {
    _id: '1',
    name: 'Grilled Salmon',
    description: 'Atlantic salmon fillet with lemon butter sauce',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600',
    rating: 4.8,
    totalReviews: 156,
  },
  {
    _id: '2',
    name: 'Beef Steak',
    description: 'Prime cut ribeye with truffle mashed potatoes',
    price: 32.99,
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600',
    rating: 4.9,
    totalReviews: 203,
  },
];

export default function WishlistPage() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Box sx={{ py: 8, textAlign: 'center', minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <Container maxWidth="sm">
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            Sign in to view your wishlist
          </Typography>
          <Button component={Link} href={ROUTES.LOGIN} variant="contained">
            Sign In
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ py: { xs: 4, md: 8 }, bgcolor: 'background.default', minHeight: '80vh' }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
          Your Wishlist
        </Typography>

        <Grid container spacing={3}>
          {sampleWishlist.map((item) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item._id}>
              <Card sx={{ height: '100%', position: 'relative' }}>
                <IconButton
                  sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.9)' }}
                  color="secondary"
                >
                  <FavoriteIcon />
                </IconButton>
                <CardMedia component="img" height={200} image={item.image} alt={item.name} sx={{ objectFit: 'cover' }} />
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{item.description}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Rating value={item.rating} precision={0.5} readOnly size="small" />
                    <Typography variant="caption" color="text.secondary">({item.totalReviews})</Typography>
                  </Box>
                  <Typography variant="h6" color="secondary.main" sx={{ fontWeight: 700 }}>
                    ${item.price}
                  </Typography>
                  <Button variant="contained" fullWidth sx={{ mt: 2 }} startIcon={<ShoppingCartIcon />}>
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
