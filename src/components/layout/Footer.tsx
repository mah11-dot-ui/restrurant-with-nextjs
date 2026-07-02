import { Box, Container, Grid, Typography, Link, IconButton, Divider } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

const footerLinks = {
  QuickLinks: [
    { label: 'Menu', href: '/menu' },
    { label: 'Reservation', href: '/reservation' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  Support: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Refund Policy', href: '/refund' },
  ],
  Contact: [
    { label: 'info@savorybites.com', href: 'mailto:info@savorybites.com' },
    { label: '+1 (555) 123-4567', href: 'tel:+15551234567' },
    { label: '123 Gourmet Street, Foodville', href: '#' },
  ],
};

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        pt: 8,
        pb: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
              Savory Bites
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mb: 3, maxWidth: 300 }}>
              Premium dining experience delivered to your door. Fresh ingredients, exceptional flavors.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[FacebookIcon, TwitterIcon, InstagramIcon].map((Icon, i) => (
                <IconButton
                  key={i}
                  size="small"
                  sx={{
                    color: 'primary.contrastText',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                  }}
                >
                  <Icon fontSize="small" />
                </IconButton>
              ))}
            </Box>
          </Grid>

          {Object.entries(footerLinks).map(([title, links]) => (
            <Grid size={{ xs: 6, md: 2.67 }} key={title}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.7 }}>
                {title}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    underline="none"
                    sx={{
                      color: 'primary.contrastText',
                      opacity: 0.7,
                      fontSize: '0.875rem',
                      '&:hover': { opacity: 1 },
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />

        <Typography variant="body2" sx={{ textAlign: 'center', opacity: 0.6 }}>
          &copy; {new Date().getFullYear()} Savory Bites. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
