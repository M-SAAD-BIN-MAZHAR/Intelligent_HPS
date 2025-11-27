import { Box } from '@mui/material';
import type { BoxProps } from '@mui/material';
import type { ReactNode } from 'react';

interface GlassCardProps extends Omit<BoxProps, 'children'> {
  children: ReactNode;
  blur?: number;
  opacity?: number;
  padding?: number;
}

export const GlassCard = ({
  children,
  blur = 10,
  opacity = 0.5,
  padding = 3,
  sx,
  ...props
}: GlassCardProps) => {
  return (
    <Box
      sx={{
        background: `rgba(30, 41, 59, ${opacity})`,
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        border: '1px solid rgba(148, 163, 184, 0.1)',
        borderRadius: 3,
        padding,
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};
