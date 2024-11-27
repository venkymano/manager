import { Grid, Typography } from '@mui/material';
import React from 'react';

interface AlertOverviewDetailRowProps {
  color?: string;
  label: string;
  value: null | string;
}

export const AlertOverviewDetailRow = React.memo(
  (props: AlertOverviewDetailRowProps) => {
    const { color, label, value } = props;

    return (
      <Grid item xs={12}>
        <Grid container>
          <Grid item xs={3}>
            <Typography variant="h3">{label}:</Typography>
          </Grid>
          <Grid item xs={9}>
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
