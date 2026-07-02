'use client';

import { Box, Card, CardContent, Typography, TextField, Grid, Avatar } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfileSchema, UpdateProfileFormData } from '@/validators/auth';
import { LoadingButton } from '@/components/ui/LoadingButton';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  const { control, handleSubmit, formState: { isSubmitting } } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: user?.name || '', phone: user?.phone || '' },
  });

  const onSubmit = async (data: UpdateProfileFormData) => {
    // Profile update logic
    console.log('Update profile:', data);
  };

  return (
    <Card sx={{ maxWidth: 600 }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
          <Avatar
            src={user?.image}
            alt={user?.name}
            sx={{ width: 80, height: 80, bgcolor: 'secondary.main', fontSize: 32 }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>{user?.name}</Typography>
            <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
          </Box>
        </Box>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} label="Full Name" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Email" value={user?.email || ''} disabled fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="phone"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} label="Phone" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
                )}
              />
            </Grid>
          </Grid>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Update Profile
          </LoadingButton>
        </Box>
      </CardContent>
    </Card>
  );
}
