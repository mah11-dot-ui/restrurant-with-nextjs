'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box, Container, Typography, Grid, Card, CardContent, CardMedia,
  Chip, Rating, Button, IconButton, Skeleton, Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useCart } from '@/hooks/useCart';
import { IMenuItem } from '@/types/menu';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [item, setItem] = useState<IMenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/menu?limit=50`);
        const data = await res.json();
        if (data.success) {
          const found = data.data.find((m: IMenuItem) => m.slug === slug);
          setItem(found || null);
        }
      } catch (err) {
        console.error('Failed to fetch item', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const handleAddToCart = () => {
    if (item) {
      addItem(item, quantity);
      router.push('/cart');
    }
  };

  if (loading) {
    return (
      <Box sx={{ py: 8, bgcolor: 'background.default', minHeight: '80vh' }}>
        <Container maxWidth="md">
          <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2, mb: 3 }} />
          <Skeleton width="60%" height={40} />
          <Skeleton width="30%" height={30} />
          <Skeleton width="100%" height={100} />
        </Container>
      </Box>
    );
  }

  if (!item) {
    return (
      <Box sx={{ py: 8, textAlign: 'center', minHeight: '60vh' }}>
        <Container maxWidth="sm">
          <Typography variant="h5" sx={{ mb: 2 }}>Item not found</Typography>
          <Button startIcon={<ArrowBackIcon />} variant="outlined" onClick={() => router.push('/menu')}>
            Back to Menu
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ py: { xs: 4, md: 8 }, bgcolor: 'background.default', minHeight: '80vh' }}>
      <Container maxWidth="md">
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.push('/menu')} sx={{ mb: 3 }}>
          Back to Menu
        </Button>

        <Card>
          <Grid container>
            <Grid size={{ xs: 12, md: 6 }}>
              <CardMedia
                component="img"
                height={400}
                image={item.images[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800'}
                alt={item.name}
                sx={{ objectFit: 'cover', height: '100%', minHeight: 350 }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                  {item.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" variant="outlined" />
                  ))}
                </Box>

                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>{item.name}</Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Rating value={item.rating} precision={0.5} readOnly />
                  <Typography variant="body2" color="text.secondary">({item.totalReviews} reviews)</Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 2 }}>
                  <Typography variant="h4" color="secondary.main" sx={{ fontWeight: 700 }}>
                    ${item.discountPrice || item.price}
                  </Typography>
                  {item.discountPrice && (
                    <Typography variant="h6" color="text.disabled" sx={{ textDecoration: 'line-through' }}>
                      ${item.price}
                    </Typography>
                  )}
                </Box>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  {item.description}
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Ingredients</Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 3 }}>
                  {item.ingredients.map((ing) => (
                    <Chip key={ing} label={ing} size="small" variant="filled" color="default" />
                  ))}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Preparation time:</Typography>
                  <Chip label={`${item.preparationTime} min`} size="small" color="primary" variant="outlined" />
                </Box>

                <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', gap: 2, pt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <IconButton size="small" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography sx={{ px: 2, minWidth: 30, textAlign: 'center' }}>{quantity}</Typography>
                    <IconButton size="small" onClick={() => setQuantity(quantity + 1)}>
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    startIcon={<ShoppingCartIcon />}
                    onClick={handleAddToCart}
                    disabled={!item.isAvailable}
                  >
                    {item.isAvailable ? 'Add to Cart' : 'Unavailable'}
                  </Button>
                </Box>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      </Container>
    </Box>
  );
}
