import { Grid, Typography } from '@mui/material';
import React from 'react';

interface AlertOverviewDetailRowProps {
  color?: string;
  label: string;
  mdLabel?: number;
  mdValue?: number;
  value: null | string;
}

export const AlertOverviewDetailRow = React.memo(
  (props: AlertOverviewDetailRowProps) => {
    const { color, label, mdLabel, mdValue, value } = props;

    return (
      <Grid item xs={12}>
        <Grid container>
          <Grid item md={mdLabel ?? 4} xs={12}>
            <Typography variant="h3">{label}:</Typography>
          </Grid>
          <Grid item md={mdValue ?? 8} xs={12}>
            <Typography
              sx={{
                color,
              }}
              variant="body2"
            >
              {value}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    );
  }
);
