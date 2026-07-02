'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Alert,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextField, MenuItem } from '@mui/material';
import { LoadingButton } from '@/components/ui/LoadingButton';
import { useAuth } from '@/context/AuthContext';

const reservationSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Valid phone number is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  guests: z.number().min(1, 'At least 1 guest').max(20, 'Maximum 20 guests'),
  specialRequests: z.string().optional(),
});

type ReservationFormData = z.infer<typeof reservationSchema>;

const timeSlots = [
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00',
];

export default function ReservationPage() {
  const { user } = useAuth();
  const [success, setSuccess] = useState(false);

  const { control, handleSubmit, formState: { isSubmitting } } = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      date: '',
      time: '',
      guests: 2,
      specialRequests: '',
    },
  });

  const onSubmit = async (data: ReservationFormData) => {
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          userId: user?._id,
        }),
      });
      const result = await res.json();
      if (result.success) {
        setSuccess(true);
      }
    } catch (err) {
      console.error('Reservation failed', err);
    }
  };

  if (success) {
    return (
      <Box sx={{ py: 8, textAlign: 'center', minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <Container maxWidth="sm">
          <Alert severity="success" sx={{ mb: 3 }}>
            Your reservation has been confirmed! We look forward to serving you.
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ py: { xs: 4, md: 8 }, bgcolor: 'background.default', minHeight: '80vh' }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
            Reserve a Table
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Book your dining experience at Savory Bites
          </Typography>
        </Box>

        <Card sx={{ maxWidth: 600, mx: 'auto' }}>
          <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
            >
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
                  <Controller
                    name="email"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField {...field} label="Email" type="email" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
                    )}
                  />
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
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="guests"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        label="Number of Guests"
                        type="number"
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="date"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField {...field} label="Date" type="date" slotProps={{ inputLabel: { shrink: true } }} error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="time"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField {...field} label="Time" select error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth>
                        {timeSlots.map((t) => (
                          <MenuItem key={t} value={t}>{t}</MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>
                <Grid size={12}>
                  <Controller
                    name="specialRequests"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label="Special Requests (optional)" multiline rows={3} fullWidth />
                    )}
                  />
                </Grid>
              </Grid>

              <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                Confirm Reservation
              </LoadingButton>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
