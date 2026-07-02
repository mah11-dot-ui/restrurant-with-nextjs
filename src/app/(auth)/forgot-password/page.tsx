'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Box, Card, CardContent, Typography, Alert } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, ForgotPasswordFormData } from '@/validators/auth';
import { Input } from '@/components/ui/Input';
import { LoadingButton } from '@/components/ui/LoadingButton';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/constants';

export default function ForgotPasswordPage() {
  const { forgotPassword, isLoading, error, clearError } = useAuth();
  const [sent, setSent] = useState(false);

  const { control, handleSubmit } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPassword(data.email);
      setSent(true);
    } catch {
      // Error handled by context
    }
  };

  if (sent) {
    return (
      <Card sx={{ maxWidth: 440, width: '100%', p: { xs: 2, sm: 3 } }}>
        <CardContent sx={{ textAlign: 'center' }}>
          <EmailIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            Check Your Email
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            We&apos;ve sent a password reset link to your email. Please check your inbox and follow the instructions.
          </Typography>
          <Link href={ROUTES.LOGIN} style={{ color: 'inherit', fontWeight: 600 }}>
            Back to Sign In
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ maxWidth: 440, width: '100%', p: { xs: 2, sm: 3 } }}>
      <CardContent>
        <Typography variant="h4" sx={{ fontWeight: 800, textAlign: 'center', mb: 1 }}>
          Reset Password
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 4 }}>
          Enter your email and we&apos;ll send you a reset link
        </Typography>

        {error && (
          <Alert severity="error" onClose={clearError} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
        >
          <Input<ForgotPasswordFormData>
            name="email"
            control={control}
            label="Email"
            type="email"
            autoComplete="email"
          />

          <LoadingButton type="submit" variant="contained" size="large" loading={isLoading} fullWidth>
            Send Reset Link
          </LoadingButton>
        </Box>

        <Typography variant="body2" sx={{ textAlign: 'center', mt: 3 }}>
          Remember your password?{' '}
          <Link href={ROUTES.LOGIN} style={{ color: 'inherit', fontWeight: 600 }}>
            Sign in
          </Link>
        </Typography>
      </CardContent>
    </Card>
  );
}
