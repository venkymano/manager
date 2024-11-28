import { Grid, Typography } from '@mui/material';
import React from 'react';

interface AlertOverviewDetailRowProps {
  color?: string;
  label: string;
  value: null | string;
  xsLabel?: number;
  xsValue?: number;
}

export const AlertOverviewDetailRow = React.memo(
  (props: AlertOverviewDetailRowProps) => {
    const { color, label, value, xsLabel, xsValue } = props;

    return (
      <Grid item xs={12}>
        <Grid container>
          <Grid item xs={xsLabel ?? 4}>
            <Typography variant="h3">{label}:</Typography>
          </Grid>
          <Grid item xs={xsLabel ?? 8}>
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
