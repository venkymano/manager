import { Grid, Typography, useTheme } from '@mui/material';
import React from 'react';

interface AlertDetailRowProps {
  color?: string;
  label: string;
  mdLabel?: number;
  mdValue?: number;
  value: null | string;
}

export const AlertDetailRow = React.memo((props: AlertDetailRowProps) => {
  const { color, label, mdLabel, mdValue, value } = props;

  const theme = useTheme();

  return (
    <Grid item xs={12}>
      <Grid container>
        <Grid item md={mdLabel ?? 4} xs={12}>
          <Typography fontSize={theme.spacing(1.75)} variant="h2">
            {label}:
          </Typography>
        </Grid>
        <Grid item md={mdValue ?? 8} xs={12}>
          <Typography
            sx={{
              color,
            }}
            fontSize={theme.spacing(1.75)}
            variant="body2"
          >
            {value}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
});
