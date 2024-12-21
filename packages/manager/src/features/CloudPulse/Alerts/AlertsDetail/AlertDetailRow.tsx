import { Grid, Typography, useTheme } from '@mui/material';
import React from 'react';

import { StatusIcon } from 'src/components/StatusIcon/StatusIcon';

interface AlertDetailRowProps {
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
   * The color of the text that needs to be displayed
   */
  statusColor?: string;
  /*
   * The typography value to be displayed
   */
  value: null | string;
}

export const AlertDetailRow = React.memo((props: AlertDetailRowProps) => {
  const { label, mdLabel = 4, mdValue = 8, statusColor, value } = props;

  const theme = useTheme();

  return (
    <Grid container item>
      <Grid item md={mdLabel} xs={12}>
        <Typography fontSize={theme.spacing(1.75)} variant="h2">
          {label}:
        </Typography>
      </Grid>
      <Grid display="flex" item md={mdValue} xs={12}>
        {statusColor && ( // if the status color is passed, we will display a status icon with color needed
          <StatusIcon
            sx={{
              backgroundColor: statusColor, // here the background color is controlled by alerting component since there can be more statuses than active, inactive and other
            }}
            marginTop={theme.spacing(1)}
            maxHeight={theme.spacing(1)}
            maxWidth={theme.spacing(1)}
            pulse={false}
            status="other"
          />
        )}
        <Typography
          sx={{
            color: theme.color.offBlack,
          }}
          fontSize={theme.spacing(1.75)}
          lineHeight={'1.5rem'}
          variant="body2"
        >
          {value}
        </Typography>
      </Grid>
    </Grid>
  );
});
