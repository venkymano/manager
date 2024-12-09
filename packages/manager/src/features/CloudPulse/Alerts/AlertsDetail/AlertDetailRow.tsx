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
  mdLabel?: number;
  /*
   * Controls the size of the typography value from medium to larger screens
   */
  mdValue?: number;
  /*
   * The typography value to be displayed
   */
  value: null | string;
}

export const AlertDetailRow = React.memo((props: AlertDetailRowProps) => {
  const { color, label, mdLabel = 4, mdValue = 8, value } = props;

  const theme = useTheme();

  return (
    <Grid container item>
      <Grid item md={mdLabel} xs={12}>
        <Typography fontSize={theme.spacing(1.75)} variant="h2">
          {label}:
        </Typography>
      </Grid>
      <Grid item md={mdValue} xs={12}>
        <Typography
          sx={{
            color: color ?? theme.tokens.color.Neutrals.Black,
          }}
          fontSize={theme.spacing(1.75)}
          lineHeight={'1.5rem'}
          variant="body1"
        >
          {value}
        </Typography>
      </Grid>
    </Grid>
  );
});
