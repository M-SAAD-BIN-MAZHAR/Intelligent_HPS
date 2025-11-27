import { Box, Container, Typography, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  Activity,
  Brain,
  MessageSquare,
  Shield,
  Zap,
  Users,
  Stethoscope,
} from 'lucide-react';
import { GlassCard, GradientButton } from '../components';

const MotionBox = motion(Box);
const MotionGlassCard = motion(GlassCard);

export const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Activity size={40} />,
      title: 'Real-time Monitoring',
      description: 'Track your health metrics and get instant insights powered by AI',
    },
    {
      icon: <Brain size={40} />,
      title: 'AI Diagnostics',
      description: 'Advanced machine learning models for accurate health predictions',
    },
    {
      icon: <MessageSquare size={40} />,
      title: 'Instant Communication',
      description: 'Chat with our AI medical assistant 24/7 for health guidance',
    },
    {
      icon: <Shield size={40} />,
      title: 'Secure & Private',
      description: 'Your health data is encrypted and protected with industry standards',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <MotionBox
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          {/* Hero Section */}
          <MotionBox variants={itemVariants} sx={{ textAlign: 'center', mt: 4 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mb: 3,
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Heart size={80} color="#8b5cf6" fill="#8b5cf6" />
              </motion.div>
            </Box>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                fontWeight: 800,
                mb: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Smart Healthcare System
            </Typography>
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{
                mb: 4,
                maxWidth: 700,
                mx: 'auto',
                fontSize: { xs: '1rem', sm: '1.25rem' },
              }}
            >
              Your intelligent hospital management system powered by AI. Get instant health
              assessments, diagnoses, and personalized care recommendations.
            </Typography>
          </MotionBox>

          {/* Role Selection */}
          <MotionBox variants={itemVariants}>
            <GlassCard
              sx={{
                p: 4,
                textAlign: 'center',
              }}
            >
              <Typography variant="h4" fontWeight={600} sx={{ mb: 3 }}>
                Choose Your Portal
              </Typography>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={3}
                justifyContent="center"
                alignItems="stretch"
              >
                <Box sx={{ flex: 1, maxWidth: { sm: 400 } }}>
                  <MotionBox
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    sx={{ height: '100%' }}
                  >
                    <GlassCard
                      sx={{
                        p: 4,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 40px 0 rgba(139, 92, 246, 0.3)',
                        },
                      }}
                      onClick={() => navigate('/login')}
                    >
                      <Users size={60} color="#8b5cf6" />
                      <Typography variant="h5" fontWeight={600} sx={{ mt: 2, mb: 1 }}>
                        Patient Portal
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Access your health records, get AI-powered diagnoses, and chat with our
                        medical assistant
                      </Typography>
                      <GradientButton variant="primary" fullWidth>
                        Enter as Patient
                      </GradientButton>
                    </GlassCard>
                  </MotionBox>
                </Box>
                <Box sx={{ flex: 1, maxWidth: { sm: 400 } }}>
                  <MotionBox
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    sx={{ height: '100%' }}
                  >
                    <GlassCard
                      sx={{
                        p: 4,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 40px 0 rgba(79, 172, 254, 0.3)',
                        },
                      }}
                      onClick={() => navigate('/doctor/dashboard')}
                    >
                      <Stethoscope size={60} color="#4facfe" />
                      <Typography variant="h5" fontWeight={600} sx={{ mt: 2, mb: 1 }}>
                        Doctor Dashboard
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Manage patient records, view reports, and access comprehensive analytics
                      </Typography>
                      <GradientButton variant="secondary" fullWidth>
                        Enter as Doctor
                      </GradientButton>
                    </GlassCard>
                  </MotionBox>
                </Box>
              </Stack>
            </GlassCard>
          </MotionBox>

          {/* Features Section */}
          <MotionBox variants={itemVariants}>
            <Typography
              variant="h3"
              fontWeight={700}
              textAlign="center"
              sx={{ mb: 4, fontSize: { xs: '2rem', md: '2.5rem' } }}
            >
              Why Choose Us?
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(4, 1fr)',
                },
                gap: 3,
              }}
            >
              {features.map((feature, index) => (
                <MotionGlassCard
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  sx={{
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <Box
                    sx={{
                      color: '#8b5cf6',
                      mb: 2,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </MotionGlassCard>
              ))}
            </Box>
          </MotionBox>

          {/* CTA Section */}
          <MotionBox variants={itemVariants} sx={{ textAlign: 'center', pb: 4 }}>
            <GlassCard sx={{ p: 4 }}>
              <Zap size={48} color="#f59e0b" style={{ marginBottom: 16 }} />
              <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
                Ready to Get Started?
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}
              >
                Join thousands of patients who trust our AI-powered healthcare platform for their
                medical needs.
              </Typography>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                justifyContent="center"
                sx={{ flexWrap: 'wrap' }}
              >
                <GradientButton
                  variant="primary"
                  size="large"
                  onClick={() => navigate('/register')}
                >
                  Create Account
                </GradientButton>
                <GradientButton variant="secondary" size="large" onClick={() => navigate('/login')}>
                  Sign In
                </GradientButton>
              </Stack>
            </GlassCard>
          </MotionBox>
        </MotionBox>
      </Container>
    </Box>
  );
};
