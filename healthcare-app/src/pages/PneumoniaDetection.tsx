import {
  Box,
  Container,
  Typography,
  Alert,
  IconButton,
  Stack,
  Paper,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, ArrowLeft, Upload, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { GlassCard, GradientButton } from '../components';
import { useState, useCallback } from 'react';
import apiClient from '../services/api';
import type { PneumoniaResult } from '../types';

const MotionBox = motion(Box);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

export const PneumoniaDetection = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<PneumoniaResult | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Please upload a JPG or PNG image file.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 5MB.';
    }
    return null;
  };

  const handleFileSelect = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSelectedFile(file);
    setError(null);
    setResult(null);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Please select an image file first.');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await apiClient.post('/pneumonia/detect', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to analyze image. Please ensure the backend API is running.'
      );
    } finally {
      setIsUploading(false);
    }
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
                Pneumonia Detection
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Upload a chest X-ray image for AI-powered pneumonia detection
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
              <Stethoscope size={40} color="#8b5cf6" />
            </Box>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
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
                      result.label === 'Pneumonia'
                        ? 'rgba(239, 68, 68, 0.1)'
                        : 'rgba(16, 185, 129, 0.1)',
                    border: `2px solid ${result.label === 'Pneumonia' ? '#ef4444' : '#10b981'}`,
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    {result.label === 'Pneumonia' ? (
                      <AlertCircle size={48} color="#ef4444" />
                    ) : (
                      <CheckCircle2 size={48} color="#10b981" />
                    )}
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h5"
                        fontWeight={700}
                        sx={{ color: result.label === 'Pneumonia' ? '#ef4444' : '#10b981' }}
                      >
                        {result.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Confidence: {(result.probability * 100).toFixed(1)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {result.label === 'Pneumonia'
                          ? 'The X-ray shows signs of pneumonia. Please consult with a healthcare professional immediately for proper diagnosis and treatment.'
                          : 'The X-ray appears normal. However, this is not a substitute for professional medical diagnosis.'}
                      </Typography>
                    </Box>
                  </Stack>
                </GlassCard>
              </MotionBox>
            )}

            {/* Image Upload Area */}
            {!previewUrl ? (
              <Box
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                sx={{
                  border: `2px dashed ${isDragging ? '#8b5cf6' : 'rgba(148, 163, 184, 0.3)'}`,
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  background: isDragging ? 'rgba(139, 92, 246, 0.05)' : 'rgba(148, 163, 184, 0.05)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: '#8b5cf6',
                    background: 'rgba(139, 92, 246, 0.05)',
                  },
                }}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <Upload size={48} color="#8b5cf6" style={{ marginBottom: 16 }} />
                <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                  Drop your X-ray image here
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  or click to browse files
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Supported formats: JPG, PNG (Max size: 5MB)
                </Typography>
                <input
                  id="file-input"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleFileInputChange}
                  style={{ display: 'none' }}
                />
              </Box>
            ) : (
              /* Image Preview */
              <Box sx={{ mb: 3 }}>
                <Paper
                  elevation={0}
                  sx={{
                    position: 'relative',
                    borderRadius: 2,
                    overflow: 'hidden',
                    background: 'rgba(148, 163, 184, 0.05)',
                  }}
                >
                  <Box
                    component="img"
                    src={previewUrl}
                    alt="X-ray preview"
                    sx={{
                      width: '100%',
                      maxHeight: 400,
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                  <IconButton
                    onClick={handleRemoveFile}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      background: 'rgba(0, 0, 0, 0.6)',
                      color: 'white',
                      '&:hover': {
                        background: 'rgba(0, 0, 0, 0.8)',
                      },
                    }}
                  >
                    <X size={20} />
                  </IconButton>
                </Paper>
                {selectedFile && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </Typography>
                )}
              </Box>
            )}

            {/* Action Buttons */}
            {previewUrl && (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
                <GradientButton
                  variant="primary"
                  fullWidth
                  loading={isUploading}
                  disabled={isUploading || !selectedFile}
                  onClick={handleSubmit}
                >
                  {isUploading ? 'Analyzing...' : 'Analyze X-Ray'}
                </GradientButton>
                <GradientButton
                  variant="secondary"
                  fullWidth
                  onClick={handleRemoveFile}
                  disabled={isUploading}
                >
                  Upload Different Image
                </GradientButton>
              </Stack>
            )}

            {/* Disclaimer */}
            <Box sx={{ mt: 3, p: 2, background: 'rgba(148, 163, 184, 0.1)', borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary">
                <strong>Medical Disclaimer:</strong> This AI-powered tool is for educational and
                informational purposes only. It should not be used as a substitute for professional
                medical advice, diagnosis, or treatment. Always seek the advice of your physician or
                other qualified health provider with any questions you may have regarding a medical
                condition.
              </Typography>
            </Box>
          </GlassCard>
        </MotionBox>
      </Container>
    </Box>
  );
};
