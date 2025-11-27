import {
  Box,
  Container,
  Typography,
  TextField,
  Alert,
  Link as MuiLink,
  MenuItem,
  Stack,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus, ArrowLeft } from 'lucide-react';
import { GlassCard, GradientButton } from '../components';
import { useStore } from '../store/useStore';
import { registrationSchema } from '../utils/validation';
import type { RegistrationData, Gender, BloodType } from '../types';
import { useState } from 'react';

const MotionBox = motion(Box);

const genderOptions: Gender[] = ['Male', 'Female', 'Other', 'Prefer not to say'];
const bloodTypeOptions: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const RegisterPage = () => {
  const navigate = useNavigate();
  const registerUser = useStore((state) => state.register);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
  });

  const password = watch('password');

  // Calculate password strength
  const calculatePasswordStrength = (pwd: string): string => {
    if (!pwd) return '';
    if (pwd.length < 8) return 'weak';
    if (pwd.length < 12) return 'medium';
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(pwd))
      return 'strong';
    return 'medium';
  };

  const strength = calculatePasswordStrength(password);

  const getStrengthColor = (str: string) => {
    switch (str) {
      case 'weak':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'strong':
        return '#10b981';
      default:
        return 'transparent';
    }
  };

  const onSubmit = async (data: RegistrationData) => {
    try {
      setApiError(null);
      await registerUser(data);
      navigate('/patient/dashboard', { replace: true });
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : 'Registration failed. Please try again.'
      );
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
        py: 6,
      }}
    >
      <Container maxWidth="md">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Back Button */}
          <Box sx={{ mb: 3 }}>
            <MuiLink
              component={Link}
              to="/"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                color: 'text.secondary',
                textDecoration: 'none',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              <ArrowLeft size={20} />
              Back to Home
            </MuiLink>
          </Box>

          <GlassCard sx={{ p: 4 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  p: 2,
                  borderRadius: 2,
                  background: 'rgba(139, 92, 246, 0.1)',
                  mb: 2,
                }}
              >
                <UserPlus size={40} color="#8b5cf6" />
              </Box>
              <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                Create Your Account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Join our healthcare platform and get AI-powered health insights
              </Typography>
            </Box>

            {/* Error Alert */}
            {apiError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {apiError}
              </Alert>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Personal Information */}
                <Typography variant="h6" fontWeight={600}>
                  Personal Information
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    label="First Name"
                    fullWidth
                    {...register('firstName')}
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                    autoComplete="given-name"
                  />
                  <TextField
                    label="Last Name"
                    fullWidth
                    {...register('lastName')}
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                    autoComplete="family-name"
                  />
                </Stack>

                <TextField
                  label="Email Address"
                  type="email"
                  fullWidth
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  autoComplete="email"
                />

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    label="Phone Number"
                    fullWidth
                    {...register('phone')}
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                    autoComplete="tel"
                  />
                  <TextField
                    label="Patient ID"
                    fullWidth
                    {...register('patientId')}
                    error={!!errors.patientId}
                    helperText={errors.patientId?.message}
                  />
                </Stack>

                <TextField
                  label="Address"
                  fullWidth
                  multiline
                  rows={2}
                  {...register('address')}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  autoComplete="street-address"
                />

                <TextField
                  label="Emergency Contact"
                  fullWidth
                  {...register('emergencyContact')}
                  error={!!errors.emergencyContact}
                  helperText={errors.emergencyContact?.message}
                />

                {/* Medical Information */}
                <Typography variant="h6" fontWeight={600} sx={{ mt: 2 }}>
                  Medical Information
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Controller
                    name="dateOfBirth"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        label="Date of Birth"
                        type="date"
                        fullWidth
                        {...field}
                        value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                        onChange={(e) => field.onChange(new Date(e.target.value))}
                        error={!!errors.dateOfBirth}
                        helperText={errors.dateOfBirth?.message}
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                  />
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        select
                        label="Gender"
                        fullWidth
                        {...field}
                        error={!!errors.gender}
                        helperText={errors.gender?.message}
                      >
                        {genderOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Stack>

                <Controller
                  name="bloodType"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      select
                      label="Blood Type"
                      fullWidth
                      {...field}
                      error={!!errors.bloodType}
                      helperText={errors.bloodType?.message}
                    >
                      {bloodTypeOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />

                {/* Account Security */}
                <Typography variant="h6" fontWeight={600} sx={{ mt: 2 }}>
                  Account Security
                </Typography>

                <Box>
                  <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    {...register('password')}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    autoComplete="new-password"
                  />
                  {password && (
                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          flex: 1,
                          height: 4,
                          borderRadius: 2,
                          background: 'rgba(148, 163, 184, 0.2)',
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            height: '100%',
                            width:
                              strength === 'weak' ? '33%' : strength === 'medium' ? '66%' : '100%',
                            background: getStrengthColor(strength),
                            transition: 'all 0.3s ease',
                          }}
                        />
                      </Box>
                      <Typography variant="caption" sx={{ color: getStrengthColor(strength) }}>
                        {strength.charAt(0).toUpperCase() + strength.slice(1)}
                      </Typography>
                    </Box>
                  )}
                </Box>

                <TextField
                  label="Confirm Password"
                  type="password"
                  fullWidth
                  {...register('confirmPassword')}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  autoComplete="new-password"
                />

                {/* Submit Button */}
                <GradientButton
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  size="large"
                  sx={{ mt: 2 }}
                >
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </GradientButton>

                {/* Divider */}
                <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                  <Typography variant="body2">
                    Already have an account?{' '}
                    <MuiLink
                      component={Link}
                      to="/login"
                      sx={{
                        color: 'primary.main',
                        textDecoration: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Sign In
                    </MuiLink>
                  </Typography>
                </Box>
              </Box>
            </form>
          </GlassCard>

          {/* Demo Info */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Note: This is a demo. The backend API needs to be running for registration to work.
            </Typography>
          </Box>
        </MotionBox>
      </Container>
    </Box>
  );
};
