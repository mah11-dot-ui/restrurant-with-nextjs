'use client';

import { Box, Grid, Card, CardContent, Typography } from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const stats = [
  { label: 'Total Revenue', value: '$24,580', icon: TrendingUpIcon, color: '#10b981', change: '+12.5%' },
  { label: 'Total Orders', value: '342', icon: ShoppingBagIcon, color: '#e94560', change: '+8.2%' },
  { label: 'Menu Items', value: '48', icon: RestaurantMenuIcon, color: '#1a1a2e', change: '+3' },
  { label: 'Total Users', value: '1,280', icon: PeopleIcon, color: '#16213e', change: '+15.3%' },
];

export default function AdminDashboard() {
  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        Overview
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.label}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <stat.icon sx={{ fontSize: 40, color: stat.color }} />
                  <Typography variant="caption" sx={{ color: stat.change.startsWith('+') ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                    {stat.change}
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
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

      <Card sx={{ mt: 4, p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Recent Orders
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No recent orders to display. Orders will appear here once customers start ordering.
        </Typography>
      </Card>
    </Box>
  );
}
