import { Box, Container, Typography, TextField, Alert, Link as MuiLink } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn, ArrowLeft } from 'lucide-react';
import { GlassCard, GradientButton } from '../components';
import { useStore } from '../store/useStore';
import { loginSchema } from '../utils/validation';
import type { LoginCredentials } from '../types';
import { useState } from 'react';

const MotionBox = motion(Box);

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useStore((state) => state.login);
  const [apiError, setApiError] = useState<string | null>(null);

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname || '/patient/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginCredentials) => {
    try {
      setApiError(null);
      await login(data);
      navigate(from, { replace: true });
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Login failed. Please try again.');
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
      }}
    >
      <Container maxWidth="sm">
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
                <LogIn size={40} color="#8b5cf6" />
              </Box>
              <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                Welcome Back
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in to access your healthcare dashboard
              </Typography>
            </Box>

            {/* Error Alert */}
            {apiError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {apiError}
              </Alert>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Email Field */}
                <TextField
                  label="Email Address"
                  type="email"
                  fullWidth
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  autoComplete="email"
                  autoFocus
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(148, 163, 184, 0.3)',
                      },
                    },
                  }}
                />

                {/* Password Field */}
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  {...register('password')}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  autoComplete="current-password"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(148, 163, 184, 0.3)',
                      },
                    },
                  }}
                />

                {/* Submit Button */}
                <GradientButton
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  size="large"
                >
                  {isSubmitting ? 'Signing In...' : 'Sign In'}
                </GradientButton>

                {/* Divider */}
                <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                  <Typography variant="body2">
                    Don't have an account?{' '}
                    <MuiLink
                      component={Link}
                      to="/register"
                      sx={{
                        color: 'primary.main',
                        textDecoration: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Create Account
                    </MuiLink>
                  </Typography>
                </Box>
              </Box>
            </form>
          </GlassCard>

          {/* Demo Credentials Info */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Note: This is a demo. The backend API needs to be running for authentication to work.
            </Typography>
          </Box>
        </MotionBox>
      </Container>
    </Box>
  );
};
