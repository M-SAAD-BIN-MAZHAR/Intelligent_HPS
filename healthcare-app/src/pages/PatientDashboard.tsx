import { Box, Container, Typography, Avatar, IconButton, Stack, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Stethoscope,
  Brain,
  MessageSquare,
  LogOut,
  User,
  Calendar,
  Phone,
  Mail,
} from 'lucide-react';
import { GlassCard } from '../components';
import { useStore } from '../store/useStore';

const MotionBox = motion(Box);
const MotionGlassCard = motion(GlassCard);

interface ServiceCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
  gradient: string;
}

export const PatientDashboard = () => {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const services: ServiceCard[] = [
    {
      title: 'Health Risk Prediction',
      description: 'Get AI-powered health risk assessment based on your lifestyle and metrics',
      icon: <Activity size={40} />,
      path: '/patient/health-prediction',
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      title: 'Pneumonia Detection',
      description: 'Upload chest X-ray images for instant AI-powered pneumonia diagnosis',
      icon: <Stethoscope size={40} />,
      path: '/patient/pneumonia-detection',
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    {
      title: 'Depression Assessment',
      description: 'Complete a comprehensive mental health assessment questionnaire',
      icon: <Brain size={40} />,
      path: '/patient/depression-assessment',
      color: '#ec4899',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      title: 'Medical Chatbot',
      description: 'Chat with our AI medical assistant for health guidance and information',
      icon: <MessageSquare size={40} />,
      path: '/patient/chatbot',
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
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
            gap: 4,
          }}
        >
          {/* Dashboard Header */}
          <MotionBox variants={itemVariants}>
            <GlassCard sx={{ p: 3 }}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={3}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                justifyContent="space-between"
              >
                {/* User Profile Section */}
                <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
                  <Avatar
                    sx={{
                      width: 64,
                      height: 64,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      fontSize: '1.5rem',
                      fontWeight: 700,
                    }}
                  >
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight={700}>
                      Welcome back, {user?.firstName}!
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Patient ID: {user?.patientId || 'N/A'}
                    </Typography>
                  </Box>
                </Stack>

                {/* Logout Button */}
                <IconButton
                  onClick={handleLogout}
                  sx={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    '&:hover': {
                      background: 'rgba(239, 68, 68, 0.2)',
                    },
                  }}
                  aria-label="Logout"
                >
                  <LogOut size={20} color="#ef4444" />
                </IconButton>
              </Stack>

              {/* User Details */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ mt: 3 }}
                flexWrap="wrap"
              >
                {user?.email && (
                  <Chip
                    icon={<Mail size={16} />}
                    label={user.email}
                    variant="outlined"
                    sx={{ borderColor: 'rgba(148, 163, 184, 0.3)' }}
                  />
                )}
                {user?.phone && (
                  <Chip
                    icon={<Phone size={16} />}
                    label={user.phone}
                    variant="outlined"
                    sx={{ borderColor: 'rgba(148, 163, 184, 0.3)' }}
                  />
                )}
                {user?.bloodType && (
                  <Chip
                    icon={<Activity size={16} />}
                    label={`Blood Type: ${user.bloodType}`}
                    variant="outlined"
                    sx={{ borderColor: 'rgba(148, 163, 184, 0.3)' }}
                  />
                )}
                {user?.dateOfBirth && (
                  <Chip
                    icon={<Calendar size={16} />}
                    label={`DOB: ${new Date(user.dateOfBirth).toLocaleDateString()}`}
                    variant="outlined"
                    sx={{ borderColor: 'rgba(148, 163, 184, 0.3)' }}
                  />
                )}
              </Stack>
            </GlassCard>
          </MotionBox>

          {/* Services Section */}
          <MotionBox variants={itemVariants}>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
              Healthcare Services
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                },
                gap: 3,
              }}
            >
              {services.map((service, index) => (
                <MotionGlassCard
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  sx={{
                    p: 3,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: `0 12px 40px 0 ${service.color}40`,
                    },
                  }}
                  onClick={() => navigate(service.path)}
                >
                  <Box
                    sx={{
                      display: 'inline-flex',
                      p: 2,
                      borderRadius: 2,
                      background: `${service.color}20`,
                      mb: 2,
                    }}
                  >
                    <Box sx={{ color: service.color }}>{service.icon}</Box>
                  </Box>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                    {service.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {service.description}
                  </Typography>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1,
                      color: service.color,
                      fontWeight: 600,
                      fontSize: '0.875rem',
                    }}
                  >
                    Get Started →
                  </Box>
                </MotionGlassCard>
              ))}
            </Box>
          </MotionBox>

          {/* Quick Stats or Info Section */}
          <MotionBox variants={itemVariants}>
            <GlassCard sx={{ p: 3 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center">
                <Box
                  sx={{
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: 2,
                    background: 'rgba(139, 92, 246, 0.1)',
                  }}
                >
                  <User size={32} color="#8b5cf6" />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
                    Your Health Journey Starts Here
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Use our AI-powered tools to monitor your health, get instant diagnoses, and
                    receive personalized recommendations. All your data is secure and private.
                  </Typography>
                </Box>
              </Stack>
            </GlassCard>
          </MotionBox>
        </MotionBox>
      </Container>
    </Box>
  );
};
