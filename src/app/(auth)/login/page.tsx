'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Alert,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/validators/auth';
import { Input } from '@/components/ui/Input';
import { LoadingButton } from '@/components/ui/LoadingButton';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/constants';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle, isLoading, error, clearError } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);

  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
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
    <Card
      sx={{
        maxWidth: 440,
        width: '100%',
        p: { xs: 2, sm: 3 },
      }}
    >
      <CardContent>
        <Typography variant="h4" sx={{ fontWeight: 800, textAlign: 'center', mb: 1 }}>
          Welcome Back
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 4 }}>
          Sign in to your account to continue
        </Typography>

        {error && (
          <Alert severity="error" onClose={clearError} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Input<LoginFormData>
            name="email"
            control={control}
            label="Email"
            type="email"
            autoComplete="email"
          />
          <Input<LoginFormData>
            name="password"
            control={control}
            label="Password"
            type="password"
            autoComplete="current-password"
          />

          <Box sx={{ textAlign: 'right' }}>
            <Link
              href={ROUTES.FORGOT_PASSWORD}
              style={{ color: 'inherit', fontSize: '0.875rem', textDecoration: 'none' }}
            >
              Forgot password?
            </Link>
          </Box>

          <LoadingButton
            type="submit"
            variant="contained"
            size="large"
            loading={isLoading}
            fullWidth
          >
            Sign In
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
          Don&apos;t have an account?{' '}
          <Link href={ROUTES.REGISTER} style={{ color: 'inherit', fontWeight: 600 }}>
            Sign up
          </Link>
        </Typography>
      </CardContent>
    </Card>
  );
}
