import { Button, CircularProgress } from '@mui/material';
import type { ButtonProps } from '@mui/material';
import type { ReactNode } from 'react';

interface GradientButtonProps extends Omit<ButtonProps, 'variant'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
}

export const GradientButton = ({
  children,
  variant = 'primary',
  loading = false,
  disabled,
  sx,
  ...props
}: GradientButtonProps) => {
  const gradients = {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    secondary: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  };

  return (
    <Button
      disabled={disabled || loading}
      sx={{
        background: gradients[variant],
        color: 'white',
        fontWeight: 600,
        padding: '12px 32px',
        borderRadius: 3,
        textTransform: 'none',
        fontSize: '1rem',
        boxShadow: '0 4px 15px 0 rgba(116, 79, 168, 0.4)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 20px 0 rgba(116, 79, 168, 0.6)',
          background: gradients[variant],
        },
        '&:active': {
          transform: 'translateY(0)',
        },
        '&:disabled': {
          background: 'rgba(148, 163, 184, 0.3)',
          color: 'rgba(241, 245, 249, 0.5)',
        },
        ...sx,
      }}
      {...props}
    >
      {loading ? (
        <>
          <CircularProgress size={20} sx={{ color: 'white', mr: 1 }} />
          {children}
        </>
      ) : (
        children
      )}
    </Button>
  );
};
