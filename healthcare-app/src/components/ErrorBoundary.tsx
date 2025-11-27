import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { AlertCircle } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
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
          <GlassCard
            sx={{
              maxWidth: 500,
              textAlign: 'center',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <AlertCircle size={64} color="#ef4444" />
              <Typography variant="h4" fontWeight={600}>
                Oops! Something went wrong
              </Typography>
              <Typography variant="body1" color="text.secondary">
                We're sorry for the inconvenience. An unexpected error has occurred.
              </Typography>
              {this.state.error && (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    background: 'rgba(239, 68, 68, 0.1)',
                    borderRadius: 2,
                    width: '100%',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'monospace',
                      color: '#f87171',
                      wordBreak: 'break-word',
                    }}
                  >
                    {this.state.error.message}
                  </Typography>
                </Box>
              )}
              <Button
                variant="contained"
                onClick={this.handleReset}
                sx={{
                  mt: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                Return to Home
              </Button>
            </Box>
          </GlassCard>
        </Box>
      );
    }

    return this.props.children;
  }
}
