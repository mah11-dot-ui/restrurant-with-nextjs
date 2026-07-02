'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Rating,
  Skeleton,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartAddIcon from '@mui/icons-material/ShoppingCart';
import Link from 'next/link';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface MenuItem {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: Category;
  isAvailable: boolean;
  isFeatured: boolean;
  preparationTime: number;
  rating: number;
  totalReviews: number;
}

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch('/api/categories', { signal: controller.signal });
        const data = await res.json();
        if (data.success) setCategories(data.data);
      } catch (err) {
        if (!controller.signal.aborted) console.error('Failed to fetch categories', err);
      }
    })();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const params = new URLSearchParams({ available: 'true', limit: '50' });
        if (selectedCategory) params.set('category', selectedCategory);
        const res = await fetch(`/api/menu?${params}`, { signal: controller.signal });
        const data = await res.json();
        if (data.success) setMenuItems(data.data);
        setLoading(false);
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error('Failed to fetch menu items', err);
          setLoading(false);
        }
      }
    })();
    return () => controller.abort();
  }, [selectedCategory]);

  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ py: { xs: 4, md: 8 }, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
            Our Menu
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Explore our carefully crafted selection of dishes made with the freshest ingredients.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 4, alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label="All"
              variant={selectedCategory === '' ? 'filled' : 'outlined'}
              color={selectedCategory === '' ? 'primary' : 'default'}
              onClick={() => setSelectedCategory('')}
            />
            {categories.map((cat) => (
              <Chip
                key={cat._id}
                label={cat.name}
                variant={selectedCategory === cat._id ? 'filled' : 'outlined'}
                color={selectedCategory === cat._id ? 'primary' : 'default'}
                onClick={() => setSelectedCategory(cat._id)}
              />
            ))}
          </Box>

          <TextField
            size="small"
            placeholder="Search menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ minWidth: 280 }}
          />
        </Box>

        <Grid container spacing={3}>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                  <Card>
                    <Skeleton variant="rectangular" height={200} />
                    <CardContent>
                      <Skeleton width="80%" />
                      <Skeleton width="40%" />
                    </CardContent>
                  </Card>
                </Grid>
              ))
            : filteredItems.map((item) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item._id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': { transform: 'translateY(-4px)' },
                      position: 'relative',
                    }}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height={200}
                        image={item.images[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'}
                        alt={item.name}
                        sx={{ objectFit: 'cover' }}
                      />
                      {item.discountPrice && (
                        <Chip
                          label={`$${(item.price - item.discountPrice).toFixed(2)} OFF`}
                          color="secondary"
                          size="small"
                          sx={{ position: 'absolute', top: 12, left: 12, fontWeight: 600 }}
                        />
                      )}
                      {item.preparationTime <= 15 && (
                        <Chip
                          label="Quick"
                          color="success"
                          size="small"
                          sx={{ position: 'absolute', top: 12, right: 12, fontWeight: 600 }}
                        />
                      )}
                    </Box>
                    <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                          {item.name}
                        </Typography>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography
                            variant="h6"
                            color="secondary.main"
                            sx={{ fontWeight: 700, fontSize: '1rem' }}
                          >
                            ${item.discountPrice || item.price}
                          </Typography>
                          {item.discountPrice && (
                            <Typography
                              variant="caption"
                              color="text.disabled"
                              sx={{ textDecoration: 'line-through' }}
                            >
                              ${item.price}
                            </Typography>
                          )}
                        </Box>
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1, flex: 1 }}
                      >
                        {item.description}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Rating value={item.rating} precision={0.5} readOnly size="small" />
                        <Typography variant="caption" color="text.secondary">
                          ({item.totalReviews})
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                        <IconButton
                          color="primary"
                          size="small"
                          sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
                        >
                          <ShoppingCartAddIcon />
                        </IconButton>
                        <Box sx={{ flex: 1 }}>
                          <Link href={`/menu/${item.slug}`} passHref legacyBehavior>
                            <Typography
                              component="a"
                              variant="body2"
                              sx={{
                                display: 'inline-block',
                                fontWeight: 600,
                                color: 'primary.main',
                                textDecoration: 'none',
                                '&:hover': { textDecoration: 'underline' },
                              }}
                            >
                              View Details
                            </Typography>
                          </Link>
                        </Box>
                        <Typography variant="caption" color="text.disabled">
                          {item.preparationTime} min
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
        </Grid>

        {!loading && filteredItems.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No menu items found.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}
