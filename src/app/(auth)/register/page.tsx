'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Box, Card, CardContent, Typography, Divider, Alert } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormData } from '@/validators/auth';
import { Input } from '@/components/ui/Input';
import { LoadingButton } from '@/components/ui/LoadingButton';
import { useAuth } from '@/context/AuthContext';
import { ROUTES, PASSWORD_RULES } from '@/constants';

export default function RegisterPage() {
  const router = useRouter();
  const { register, loginWithGoogle, isLoading, error, clearError } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);

  const { control, handleSubmit } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await register(data);
      router.push(ROUTES.HOME);
    } catch {
      // Error handled by context
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      router.push(ROUTES.HOME);
    } catch {
      // Error handled by context
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 480, width: '100%', p: { xs: 2, sm: 3 } }}>
      <CardContent>
        <Typography variant="h4" sx={{ fontWeight: 800, textAlign: 'center', mb: 1 }}>
          Create Account
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 4 }}>
          Join us and start your culinary journey
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
          <Input<RegisterFormData>
            name="name"
            control={control}
            label="Full Name"
            autoComplete="name"
          />
          <Input<RegisterFormData>
            name="email"
            control={control}
            label="Email"
            type="email"
            autoComplete="email"
          />
          <Input<RegisterFormData>
            name="password"
            control={control}
            label="Password"
            type="password"
            autoComplete="new-password"
            helperText={`At least ${PASSWORD_RULES.MIN_LENGTH} characters with uppercase, lowercase, number & special char`}
          />
          <Input<RegisterFormData>
            name="confirmPassword"
            control={control}
            label="Confirm Password"
            type="password"
          />

          <LoadingButton type="submit" variant="contained" size="large" loading={isLoading} fullWidth>
            Create Account
          </LoadingButton>
        </Box>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            OR
          </Typography>
        </Divider>

        <LoadingButton
          variant="outlined"
          size="large"
          fullWidth
          loading={googleLoading}
          onClick={handleGoogleLogin}
          startIcon={<GoogleIcon />}
        >
          Continue with Google
        </LoadingButton>

        <Typography variant="body2" sx={{ textAlign: 'center', mt: 3 }}>
          Already have an account?{' '}
          <Link href={ROUTES.LOGIN} style={{ color: 'inherit', fontWeight: 600 }}>
            Sign in
          </Link>
        </Typography>
      </CardContent>
    </Card>
  );
}
