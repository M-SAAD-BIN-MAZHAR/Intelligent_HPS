import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LogOut,
  Users,
  Activity,
  FileText,
  AlertCircle,
  TrendingUp,
  Calendar,
  Clock,
} from 'lucide-react';
import { GlassCard, GradientButton } from '../components';
import { useStore } from '../store/useStore';

const MotionBox = motion(Box);

export const DoctorDashboard = () => {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  // Mock statistics
  const stats = [
    {
      icon: Users,
      label: 'Total Patients',
      value: '248',
      change: '+12%',
      color: '#667eea',
    },
    {
      icon: Activity,
      label: 'Active Cases',
      value: '42',
      change: '+5%',
      color: '#10b981',
    },
    {
      icon: FileText,
      label: 'Reports Pending',
      value: '18',
      change: '-8%',
      color: '#f59e0b',
    },
    {
      icon: AlertCircle,
      label: 'Critical Alerts',
      value: '3',
      change: '+2',
      color: '#ef4444',
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <Box
            sx={{
              mb: 4,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Doctor Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Welcome back, Dr. {user?.firstName} {user?.lastName}
              </Typography>
            </Box>
            <GradientButton
              variant="secondary"
              startIcon={<LogOut size={20} />}
              onClick={handleLogout}
            >
              Logout
            </GradientButton>
          </Box>

          {/* Statistics Cards */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
            {stats.map((stat, index) => (
              <Box key={index}>
                <MotionBox
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <GlassCard sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {stat.label}
                        </Typography>
                        <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                          {stat.value}
                        </Typography>
                        <Chip
                          label={stat.change}
                          size="small"
                          sx={{
                            background: `${stat.color}20`,
                            color: stat.color,
                            fontWeight: 600,
                            fontSize: '0.75rem',
                          }}
                        />
                      </Box>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          background: `${stat.color}20`,
                        }}
                      >
                        <stat.icon size={24} color={stat.color} />
                      </Box>
                    </Box>
                  </GlassCard>
                </MotionBox>
              </Box>
            ))}
          </Box>

          {/* Main Content */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3 }}>
            {/* Recent Patients */}
            <Box>
              <GlassCard sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Recent Patients
                  </Typography>
                  <GradientButton variant="secondary" size="small">
                    View All
                  </GradientButton>
                </Box>

                <Stack spacing={2}>
                  {[1, 2, 3, 4, 5].map((item) => (
                    <Card
                      key={item}
                      sx={{
                        background: 'rgba(148, 163, 184, 0.05)',
                        border: '1px solid rgba(148, 163, 184, 0.1)',
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" fontWeight={600}>
                              Patient #{1000 + item}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Last visit: {new Date().toLocaleDateString()}
                            </Typography>
                          </Box>
                          <Chip
                            label="Pending Review"
                            size="small"
                            sx={{
                              background: 'rgba(245, 158, 11, 0.1)',
                              color: '#f59e0b',
                            }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </GlassCard>
            </Box>

            {/* Upcoming Appointments */}
            <Box>
              <GlassCard sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      background: 'rgba(139, 92, 246, 0.1)',
                    }}
                  >
                    <Calendar size={24} color="#8b5cf6" />
                  </Box>
                  <Typography variant="h6" fontWeight={600}>
                    Today's Schedule
                  </Typography>
                </Box>

                <Stack spacing={2}>
                  {[
                    { time: '09:00 AM', patient: 'John Doe', type: 'Consultation' },
                    { time: '10:30 AM', patient: 'Jane Smith', type: 'Follow-up' },
                    { time: '02:00 PM', patient: 'Bob Johnson', type: 'Check-up' },
                    { time: '04:00 PM', patient: 'Alice Brown', type: 'Consultation' },
                  ].map((appointment, index) => (
                    <Card
                      key={index}
                      sx={{
                        background: 'rgba(148, 163, 184, 0.05)',
                        border: '1px solid rgba(148, 163, 184, 0.1)',
                      }}
                    >
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Clock size={16} color="#8b5cf6" />
                          <Typography variant="body2" fontWeight={600} color="#8b5cf6">
                            {appointment.time}
                          </Typography>
                        </Box>
                        <Typography variant="body2" fontWeight={600}>
                          {appointment.patient}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {appointment.type}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </GlassCard>
            </Box>
          </Box>

          {/* Quick Actions */}
          <Box sx={{ mt: 3 }}>
              <GlassCard sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
                  {[
                    { icon: Users, label: 'View All Patients', color: '#667eea' },
                    { icon: FileText, label: 'Generate Report', color: '#10b981' },
                    { icon: Activity, label: 'Patient Analytics', color: '#f59e0b' },
                    { icon: TrendingUp, label: 'Health Trends', color: '#ef4444' },
                  ].map((action, index) => (
                    <Box key={index}>
                      <Card
                        sx={{
                          background: `${action.color}10`,
                          border: `1px solid ${action.color}30`,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: `0 8px 16px ${action.color}20`,
                          },
                        }}
                      >
                        <CardContent sx={{ textAlign: 'center', p: 3 }}>
                          <Box
                            sx={{
                              display: 'inline-flex',
                              p: 2,
                              borderRadius: 2,
                              background: `${action.color}20`,
                              mb: 2,
                            }}
                          >
                            <action.icon size={32} color={action.color} />
                          </Box>
                          <Typography variant="body2" fontWeight={600}>
                            {action.label}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Box>
                  ))}
                </Box>
              </GlassCard>
          </Box>

          {/* Work in Progress Notice */}
          <Box sx={{ mt: 4, p: 3, background: 'rgba(139, 92, 246, 0.1)', borderRadius: 2 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 1, color: '#8b5cf6' }}>
              🚧 Work in Progress
            </Typography>
            <Typography variant="body2" color="text.secondary">
              The Doctor Dashboard is currently under development. Advanced features including patient
              management, detailed analytics, prescription management, and appointment scheduling will be
              available soon.
            </Typography>
          </Box>
        </MotionBox>
      </Container>
    </Box>
  );
};
