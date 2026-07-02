'use client';

import { Box, Container, Typography, Button, Grid, Card, CardContent, CardMedia } from '@mui/material';
import Link from 'next/link';

const featuredItems = [
  {
    name: 'Grilled Salmon',
    description: 'Atlantic salmon with herbs and lemon butter sauce',
    price: '$24.99',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600',
  },
  {
    name: 'Beef Steak',
    description: 'Prime cut with truffle mashed potatoes',
    price: '$32.99',
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600',
  },
  {
    name: 'Pasta Carbonara',
    description: 'Classic Italian with pancetta and parmesan',
    price: '$18.99',
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600',
  },
];

export default function Home() {
  return (
    <>
      <Box
        sx={{
          minHeight: '90vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          bgcolor: 'background.default',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  fontWeight: 800,
                  lineHeight: 1.1,
                  mb: 2,
                }}
              >
                Where Every Flavor
                <Box component="span" sx={{ color: 'secondary.main', display: 'block' }}>
                  Tells a Story
                </Box>
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mb: 4, fontWeight: 400, maxWidth: 500, lineHeight: 1.6 }}
              >
                Experience culinary excellence with our handcrafted dishes made from the finest ingredients.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  LinkComponent={Link}
                  href="/menu"
                  variant="contained"
                  size="large"
                  sx={{ px: 5, py: 1.5, fontSize: '1rem' }}
                >
                  Explore Menu
                </Button>
                <Button
                  LinkComponent={Link}
                  href="/reservation"
                  variant="outlined"
                  size="large"
                  sx={{ px: 5, py: 1.5, fontSize: '1rem' }}
                >
                  Reserve a Table
                </Button>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -40,
                    right: -40,
                    width: 300,
                    height: 300,
                    borderRadius: '50%',
                    bgcolor: 'secondary.main',
                    opacity: 0.08,
                  },
                }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800"
                  alt="Hero dish"
                  sx={{
                    width: '100%',
                    height: { xs: 300, md: 500 },
                    objectFit: 'cover',
                    borderRadius: 4,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
              Featured Dishes
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Discover our most beloved creations, crafted with passion and the finest ingredients.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {featuredItems.map((item) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.name}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height={240}
                    image={item.image}
                    alt={item.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {item.name}
                      </Typography>
                      <Typography variant="h6" color="secondary.main" sx={{ fontWeight: 700 }}>
                        {item.price}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              LinkComponent={Link}
              href="/menu"
              variant="outlined"
              size="large"
              sx={{ px: 5, py: 1.5 }}
            >
              View Full Menu
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
}
