import { Typography, Box, TypographyProps } from '@mui/material';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  titleProps?: TypographyProps;
}

export function SectionHeading({ title, subtitle, align = 'center', titleProps }: SectionHeadingProps) {
  return (
    <Box sx={{ textAlign: align, mb: 6 }}>
      <Typography
        variant="h3"
        component="h2"
        gutterBottom
        sx={{ fontWeight: 800 }}
        {...titleProps}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: align === 'center' ? 'auto' : undefined }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
