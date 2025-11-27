import {
  Box,
  Container,
  Typography,
  TextField,
  MenuItem,
  Alert,
  IconButton,
  Stack,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Activity, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { GlassCard, GradientButton } from '../components';
import { healthPredictionSchema } from '../utils/validation';
import { oneHotEncodeProfession } from '../utils/dataTransform';
import type { HealthData, HealthPredictionResult } from '../types';
import { useState } from 'react';
import apiClient from '../services/api';

const MotionBox = motion(Box);

const professionOptions = [
  'Doctor',
  'Driver',
  'Engineer',
  'Farmer',
  'Office Worker',
  'Student',
  'Teacher',
] as const;

export const HealthPrediction = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState<HealthPredictionResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<HealthData>({
    resolver: zodResolver(healthPredictionSchema),
    defaultValues: {
      smoking: false,
      alcohol: false,
    },
  });

  const onSubmit = async (data: HealthData) => {
    try {
      setApiError(null);
      setResult(null);

      // Transform profession to one-hot encoding
      const professionEncoded = oneHotEncodeProfession(data.profession);

      // Prepare data for API
      const apiData = {
        age: data.age,
        weight: data.weight,
        height: data.height,
        exercise: data.exercise,
        sleep: data.sleep,
        sugar_intake: data.sugarIntake,
        bmi: data.bmi,
        smoking: data.smoking ? 1 : 0,
        alcohol: data.alcohol ? 1 : 0,
        ...professionEncoded,
      };

      // Call API
      const response = await apiClient.post('/health-risk/predict', apiData);
      setResult(response.data);
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : 'Failed to get prediction. Please ensure the backend API is running.'
      );
    }
  };

  const handleReset = () => {
    reset();
    setResult(null);
    setApiError(null);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              onClick={() => navigate('/patient/dashboard')}
              sx={{ color: 'text.secondary' }}
            >
              <ArrowLeft size={24} />
            </IconButton>
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Health Risk Prediction
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Get AI-powered health risk assessment based on your lifestyle
              </Typography>
            </Box>
          </Box>

          <GlassCard sx={{ p: 4 }}>
            {/* Icon */}
            <Box
              sx={{
                display: 'inline-flex',
                p: 2,
                borderRadius: 2,
                background: 'rgba(139, 92, 246, 0.1)',
                mb: 3,
              }}
            >
              <Activity size={40} color="#8b5cf6" />
            </Box>

            {/* Error Alert */}
            {apiError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {apiError}
              </Alert>
            )}

            {/* Result Display */}
            {result && (
              <MotionBox
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                sx={{ mb: 3 }}
              >
                <GlassCard
                  sx={{
                    p: 3,
                    background:
                      result.riskPrediction === 1
                        ? 'rgba(239, 68, 68, 0.1)'
                        : 'rgba(16, 185, 129, 0.1)',
                    border: `2px solid ${result.riskPrediction === 1 ? '#ef4444' : '#10b981'}`,
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    {result.riskPrediction === 1 ? (
                      <AlertCircle size={48} color="#ef4444" />
                    ) : (
                      <CheckCircle2 size={48} color="#10b981" />
                    )}
                    <Box>
                      <Typography
                        variant="h5"
                        fontWeight={700}
                        sx={{ color: result.riskPrediction === 1 ? '#ef4444' : '#10b981' }}
                      >
                        {result.riskStatus}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {result.riskPrediction === 1
                          ? 'We recommend consulting with a healthcare professional for a comprehensive evaluation.'
                          : 'Keep maintaining your healthy lifestyle! Continue with regular exercise and balanced diet.'}
                      </Typography>
                    </Box>
                  </Stack>
                </GlassCard>
              </MotionBox>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={3}>
                <Typography variant="h6" fontWeight={600}>
                  Personal Metrics
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    label="Age (years)"
                    type="number"
                    fullWidth
                    {...register('age', { valueAsNumber: true })}
                    error={!!errors.age}
                    helperText={errors.age?.message}
                  />
                  <TextField
                    label="Weight (kg)"
                    type="number"
                    fullWidth
                    {...register('weight', { valueAsNumber: true })}
                    error={!!errors.weight}
                    helperText={errors.weight?.message}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    label="Height (cm)"
                    type="number"
                    fullWidth
                    {...register('height', { valueAsNumber: true })}
                    error={!!errors.height}
                    helperText={errors.height?.message}
                  />
                  <TextField
                    label="BMI"
                    type="number"
                    fullWidth
                    {...register('bmi', { valueAsNumber: true })}
                    error={!!errors.bmi}
                    helperText={errors.bmi?.message}
                  />
                </Stack>

                <Divider />

                <Typography variant="h6" fontWeight={600}>
                  Lifestyle Factors
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    label="Exercise (hours/day)"
                    type="number"
                    fullWidth
                    {...register('exercise', { valueAsNumber: true })}
                    error={!!errors.exercise}
                    helperText={errors.exercise?.message}
                  />
                  <TextField
                    label="Sleep (hours/day)"
                    type="number"
                    fullWidth
                    {...register('sleep', { valueAsNumber: true })}
                    error={!!errors.sleep}
                    helperText={errors.sleep?.message}
                  />
                </Stack>

                <TextField
                  label="Sugar Intake (grams/day)"
                  type="number"
                  fullWidth
                  {...register('sugarIntake', { valueAsNumber: true })}
                  error={!!errors.sugarIntake}
                  helperText={errors.sugarIntake?.message}
                />

                <Controller
                  name="profession"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      select
                      label="Profession"
                      fullWidth
                      {...field}
                      error={!!errors.profession}
                      helperText={errors.profession?.message}
                    >
                      {professionOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />

                <Divider />

                <Typography variant="h6" fontWeight={600}>
                  Habits
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Controller
                    name="smoking"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        select
                        label="Smoking"
                        fullWidth
                        {...field}
                        value={field.value ? 'yes' : 'no'}
                        onChange={(e) => field.onChange(e.target.value === 'yes')}
                        error={!!errors.smoking}
                        helperText={errors.smoking?.message}
                      >
                        <MenuItem value="no">No</MenuItem>
                        <MenuItem value="yes">Yes</MenuItem>
                      </TextField>
                    )}
                  />
                  <Controller
                    name="alcohol"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        select
                        label="Alcohol Consumption"
                        fullWidth
                        {...field}
                        value={field.value ? 'yes' : 'no'}
                        onChange={(e) => field.onChange(e.target.value === 'yes')}
                        error={!!errors.alcohol}
                        helperText={errors.alcohol?.message}
                      >
                        <MenuItem value="no">No</MenuItem>
                        <MenuItem value="yes">Yes</MenuItem>
                      </TextField>
                    )}
                  />
                </Stack>

                {/* Action Buttons */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
                  <GradientButton
                    type="submit"
                    variant="primary"
                    fullWidth
                    loading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Analyzing...' : 'Get Risk Assessment'}
                  </GradientButton>
                  <GradientButton
                    type="button"
                    variant="secondary"
                    fullWidth
                    onClick={handleReset}
                    disabled={isSubmitting}
                  >
                    Reset Form
                  </GradientButton>
                </Stack>
              </Stack>
            </form>

            {/* Disclaimer */}
            <Box sx={{ mt: 3, p: 2, background: 'rgba(148, 163, 184, 0.1)', borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary">
                <strong>Disclaimer:</strong> This assessment is for informational purposes only and
                should not be considered as medical advice. Please consult with a healthcare
                professional for proper medical evaluation.
              </Typography>
            </Box>
          </GlassCard>
        </MotionBox>
      </Container>
    </Box>
  );
};
