import { type CSSProperties } from 'react';

import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      className="toaster group"
      theme={theme as ToasterProps['theme']}
      style={
        {
          '--normal-bg': 'hsl(var(--card))',
          '--normal-text': 'hsl(var(--card-foreground))',
          '--normal-border': 'hsl(var(--border))',
          '--success-bg': 'hsl(var(--primary))',
          '--success-text': 'hsl(var(--primary-foreground))',
          '--error-bg': 'hsl(var(--destructive))',
          '--error-text': 'hsl(var(--destructive-foreground))',
          '--success-border': 'hsl(var(--primary-foreground) / 0.5)',
          '--error-border': 'hsl(var(--destructive) / 0.5)',
        } as CSSProperties
      }
      {...props}
    />
  );
};

export default Toaster;
