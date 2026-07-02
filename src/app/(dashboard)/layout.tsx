'use client';

import { ReactNode } from 'react';
import { Box, Container, Typography, Tabs, Tab } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface TabConfig {
  label: string;
  href: string;
  adminOnly?: boolean;
}

const userTabs: TabConfig[] = [
  { label: 'Dashboard', href: '/user' },
  { label: 'Orders', href: '/user/orders' },
  { label: 'Reservations', href: '/user/reservations' },
  { label: 'Profile', href: '/user/profile' },
];

const adminTabs: TabConfig[] = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Menu Items', href: '/admin/menu' },
  { label: 'Categories', href: '/admin/categories' },
  { label: 'Orders', href: '/admin/orders' },
  { label: 'Reservations', href: '/admin/reservations' },
  { label: 'Users', href: '/admin/users' },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  const isAdmin = pathname.startsWith('/admin');
  const tabs = isAdmin ? adminTabs : userTabs;
  const currentTab = tabs.findIndex((t) => pathname === t.href);

  if (!isAuthenticated) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography>Please sign in to access the dashboard.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4, bgcolor: 'background.default', minHeight: '80vh' }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
          {isAdmin ? 'Admin Dashboard' : 'My Dashboard'}
        </Typography>

        <Tabs
          value={currentTab >= 0 ? currentTab : 0}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}
        >
          {tabs.map((tab) => (
            <Tab key={tab.href} label={tab.label} component={Link} href={tab.href} />
          ))}
        </Tabs>

        {children}
      </Container>
    </Box>
  );
}
