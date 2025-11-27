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
  Slider,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Brain, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { GlassCard, GradientButton } from '../components';
import { depressionAssessmentSchema } from '../utils/validation';
import type { DepressionData, DepressionResult } from '../types';
import { useState } from 'react';
import apiClient from '../services/api';

const MotionBox = motion(Box);

const genderOptions = ['Male', 'Female', 'Other'];
const professionOptions = ['Student', 'Working Professional', 'Unemployed', 'Retired'];
const dietaryOptions = ['Healthy', 'Moderate', 'Unhealthy'];
const suicidalThoughtsOptions = ['Yes', 'No'];
const familyHistoryOptions = ['Yes', 'No'];

export const DepressionAssessment = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState<DepressionResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DepressionData>({
    resolver: zodResolver(depressionAssessmentSchema),
    defaultValues: {
      financialStress: 5,
      pressureLevel: 5,
      satisfactionLevel: 5,
    },
  });

  const onSubmit = async (data: DepressionData) => {
    try {
      setApiError(null);
      setResult(null);

      // Transform data for API
      const apiData = {
        gender: data.gender,
        age: data.age,
        profession: data.profession,
        sleep: data.sleepDuration,
        dietary: data.dietaryHabits,
        succide: data.suicidalThoughts ? 'Yes' : 'No',
        work_hours: data.workHours,
        financial: data.financialStress,
        family: data.familyHistory ? 'Yes' : 'No',
        pressure: data.pressureLevel,
        satisfaction: data.satisfactionLevel,
      };

      const response = await apiClient.post('/depression/assess', apiData);
      setResult(response.data);
    } catch (error: any) {
      let errorMessage = 'Failed to complete assessment.';
      
      if (error.response?.status === 503) {
        errorMessage = 'The depression assessment model is currently unavailable. This feature requires the backend model to be retrained with the current scikit-learn version. Please contact the system administrator.';
      } else if (error.response) {
        errorMessage = error.response.data?.detail || error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'Cannot connect to server. Please ensure the backend is running on http://localhost:8000';
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      setApiError(errorMessage);
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
                Depression Risk Assessment
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Complete this confidential questionnaire to assess your mental health
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
              <Brain size={40} color="#8b5cf6" />
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
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h5"
                        fontWeight={700}
                        sx={{ color: result.riskPrediction === 1 ? '#ef4444' : '#10b981' }}
                      >
                        {result.riskStatus}
                      </Typography>
                      {result.probability !== undefined && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          Risk Score: {(result.probability * 100).toFixed(1)}%
                        </Typography>
                      )}
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {result.riskPrediction === 1
                          ? 'Your responses indicate you may be experiencing symptoms of depression. We strongly recommend speaking with a mental health professional. Remember, seeking help is a sign of strength.'
                          : 'Your responses suggest a lower risk of depression. Continue maintaining healthy habits and reach out for support if you ever need it.'}
                      </Typography>
                      {result.riskPrediction === 1 && (
                        <Box sx={{ mt: 2, p: 2, background: 'rgba(0, 0, 0, 0.1)', borderRadius: 1 }}>
                          <Typography variant="body2" fontWeight={600}>
                            Resources:
                          </Typography>
                          <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                            • National Suicide Prevention Lifeline: 988
                          </Typography>
                          <Typography variant="caption" display="block">
                            • Crisis Text Line: Text HOME to 741741
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Stack>
                </GlassCard>
              </MotionBox>
            )}

            {/* Assessment Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={3}>
                <Typography variant="h6" fontWeight={600}>
                  Personal Information
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
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
                  <TextField
                    label="Age"
                    type="number"
                    fullWidth
                    {...register('age', { valueAsNumber: true })}
                    error={!!errors.age}
                    helperText={errors.age?.message}
                  />
                </Stack>

                <Controller
                  name="profession"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      select
                      label="Profession/Status"
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
                  Lifestyle & Health
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    label="Sleep Duration (hours/day)"
                    type="number"
                    fullWidth
                    {...register('sleepDuration', { valueAsNumber: true })}
                    error={!!errors.sleepDuration}
                    helperText={errors.sleepDuration?.message}
                  />
                  <TextField
                    label="Work/Study Hours (hours/day)"
                    type="number"
                    fullWidth
                    {...register('workHours', { valueAsNumber: true })}
                    error={!!errors.workHours}
                    helperText={errors.workHours?.message}
                  />
                </Stack>

                <Controller
                  name="dietaryHabits"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      select
                      label="Dietary Habits"
                      fullWidth
                      {...field}
                      error={!!errors.dietaryHabits}
                      helperText={errors.dietaryHabits?.message}
                    >
                      {dietaryOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />

                <Divider />

                <Typography variant="h6" fontWeight={600}>
                  Mental Health Indicators
                </Typography>

                <Controller
                  name="suicidalThoughts"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      select
                      label="Have you ever had suicidal thoughts?"
                      fullWidth
                      {...field}
                      value={field.value ? 'Yes' : 'No'}
                      onChange={(e) => field.onChange(e.target.value === 'Yes')}
                      error={!!errors.suicidalThoughts}
                      helperText={errors.suicidalThoughts?.message}
                    >
                      {suicidalThoughtsOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />

                <Controller
                  name="familyHistory"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      select
                      label="Family History of Mental Illness"
                      fullWidth
                      {...field}
                      value={field.value ? 'Yes' : 'No'}
                      onChange={(e) => field.onChange(e.target.value === 'Yes')}
                      error={!!errors.familyHistory}
                      helperText={errors.familyHistory?.message}
                    >
                      {familyHistoryOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />

                <Box>
                  <Typography variant="body2" gutterBottom>
                    Financial Stress Level (1-10)
                  </Typography>
                  <Controller
                    name="financialStress"
                    control={control}
                    render={({ field }) => (
                      <Slider
                        {...field}
                        min={1}
                        max={10}
                        marks
                        valueLabelDisplay="auto"
                        sx={{
                          '& .MuiSlider-thumb': {
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          },
                          '& .MuiSlider-track': {
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          },
                        }}
                      />
                    )}
                  />
                  {errors.financialStress && (
                    <Typography variant="caption" color="error">
                      {errors.financialStress.message}
                    </Typography>
                  )}
                </Box>

                <Box>
                  <Typography variant="body2" gutterBottom>
                    Academic/Work Pressure Level (1-10)
                  </Typography>
                  <Controller
                    name="pressureLevel"
                    control={control}
                    render={({ field }) => (
                      <Slider
                        {...field}
                        min={1}
                        max={10}
                        marks
                        valueLabelDisplay="auto"
                        sx={{
                          '& .MuiSlider-thumb': {
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          },
                          '& .MuiSlider-track': {
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          },
                        }}
                      />
                    )}
                  />
                  {errors.pressureLevel && (
                    <Typography variant="caption" color="error">
                      {errors.pressureLevel.message}
                    </Typography>
                  )}
                </Box>

                <Box>
                  <Typography variant="body2" gutterBottom>
                    Life Satisfaction Level (1-10)
                  </Typography>
                  <Controller
                    name="satisfactionLevel"
                    control={control}
                    render={({ field }) => (
                      <Slider
                        {...field}
                        min={1}
                        max={10}
                        marks
                        valueLabelDisplay="auto"
                        sx={{
                          '& .MuiSlider-thumb': {
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          },
                          '& .MuiSlider-track': {
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          },
                        }}
                      />
                    )}
                  />
                  {errors.satisfactionLevel && (
                    <Typography variant="caption" color="error">
                      {errors.satisfactionLevel.message}
                    </Typography>
                  )}
                </Box>

                {/* Action Buttons */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
                  <GradientButton
                    type="submit"
                    variant="primary"
                    fullWidth
                    loading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Analyzing...' : 'Complete Assessment'}
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
                <strong>Confidentiality Notice:</strong> This assessment is confidential and for
                informational purposes only. It is not a diagnostic tool and should not replace
                professional mental health evaluation. If you're experiencing a mental health crisis,
                please contact emergency services or a crisis helpline immediately.
              </Typography>
            </Box>
          </GlassCard>
        </MotionBox>
      </Container>
    </Box>
  );
};
