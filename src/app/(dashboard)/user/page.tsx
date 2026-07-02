'use client';

import { Box, Grid, Card, CardContent, Typography, Avatar } from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '@/context/AuthContext';

const stats = [
  { label: 'Total Orders', value: '12', icon: ShoppingBagIcon, color: '#e94560' },
  { label: 'Wishlist', value: '5', icon: FavoriteIcon, color: '#e94560' },
  { label: 'Reservations', value: '3', icon: CalendarMonthIcon, color: '#1a1a2e' },
  { label: 'Profile', value: '100%', icon: PersonIcon, color: '#16213e' },
];

export default function UserDashboard() {
  const { user } = useAuth();

  return (
    <Box>
      <Card sx={{ mb: 4, p: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
        <Avatar
          src={user?.image}
          alt={user?.name}
          sx={{ width: 72, height: 72, bgcolor: 'secondary.main', fontSize: 28 }}
        >
          {user?.name?.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Welcome back, {user?.name || 'Guest'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>
      </Card>

      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.label}>
            <Card sx={{ textAlign: 'center', py: 3 }}>
              <CardContent>
                <stat.icon sx={{ fontSize: 40, color: stat.color, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
