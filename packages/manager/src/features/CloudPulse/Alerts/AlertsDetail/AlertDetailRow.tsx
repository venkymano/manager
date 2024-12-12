import { Grid, Typography, useTheme } from '@mui/material';
import React from 'react';

interface AlertDetailRowProps {
  /*
   * The color of the text that needs to be displayed
   */
  color?: string;
  /*
   * The typography label under which the value will be displayed
   */
  label: string;
  /*
   * Controls the size of the typography label from medium to larger screens
   */
  labelWidth?: number;
  /*
   * The typography value to be displayed
   */
  value: null | string;
  /*
   * Controls the size of the typography value from medium to larger screens
   */
  valueWidth?: number;
}

export const AlertDetailRow = React.memo((props: AlertDetailRowProps) => {
  const {
    color,
    label,
    labelWidth: mdLabel = 4,
    value,
    valueWidth: mdValue = 8,
  } = props;

  const theme = useTheme();

  return (
    <Grid item xs={12}>
      <Grid container>
        <Grid item sm={mdLabel} xs={12}>
          <Typography fontSize={theme.spacing(1.75)} variant="h2">
            {label}:
          </Typography>
        </Grid>
        <Grid item sm={mdValue} xs={12}>
          <Typography
            sx={{
              color: color ?? theme.color.offBlack,
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
