'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Box, Card, CardContent, Typography, Alert, CircularProgress } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, ResetPasswordFormData } from '@/validators/auth';
import { Input } from '@/components/ui/Input';
import { LoadingButton } from '@/components/ui/LoadingButton';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/constants';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || searchParams.get('oobCode') || '';
  const { resetPassword, isLoading, error, clearError } = useAuth();

  const { control, handleSubmit } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token, password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await resetPassword(data.token, data.password);
      router.push(ROUTES.LOGIN);
    } catch {
      // Error handled by context
    }
  };

  if (!token) {
    return (
      <Card sx={{ maxWidth: 440, width: '100%', p: { xs: 2, sm: 3 } }}>
        <CardContent>
          <Alert severity="error">Invalid or missing reset token. Please request a new password reset.</Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ maxWidth: 440, width: '100%', p: { xs: 2, sm: 3 } }}>
      <CardContent>
        <Typography variant="h4" sx={{ fontWeight: 800, textAlign: 'center', mb: 1 }}>
          Set New Password
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 4 }}>
          Enter your new password below
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
          <Input<ResetPasswordFormData> name="token" control={control} label="Token" sx={{ display: 'none' }} />
          <Input<ResetPasswordFormData>
            name="password"
            control={control}
            label="New Password"
            type="password"
            autoComplete="new-password"
          />
          <Input<ResetPasswordFormData>
            name="confirmPassword"
            control={control}
            label="Confirm Password"
            type="password"
          />

          <LoadingButton type="submit" variant="contained" size="large" loading={isLoading} fullWidth>
            Reset Password
          </LoadingButton>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
          <CircularProgress />
        </Box>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
