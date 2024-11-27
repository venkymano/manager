import { Box } from '@linode/ui';
import { Grid, Typography, useTheme } from '@mui/material';
import React from 'react';

import { convertStringToCamelCasesWithSpaces } from '../../Utils/utils';

import type { Alert } from '@linode/api-v4';

interface OverviewProps {
  alert: Alert;
}
export const AlertDetailOverview = (props: OverviewProps) => {
  const { alert } = props;

  const {
    created_by,
    description,
    label,
    service_type,
    severity,
    status,
    type,
    updated,
  } = alert;

  const theme = useTheme();

  const statusColorMap = {
    disabled: theme.color.grey1,
    enabled: theme.color.green,
    failed: theme.color.red,
    provisioning: theme.color.orange,
  };

  const severityMap = {
    0: 'Severe',
    1: 'Medium',
    2: 'Low',
    3: 'Info',
  };

  return (
    <Box
      sx={(theme) => ({
        backgroundColor:
          theme.name === 'light' ? theme.color.grey5 : theme.color.grey9,
        borderRadius: 1,
        p: 1,
      })}
      height={theme.spacing(90)}
      maxHeight={theme.spacing(90)}
      overflow={'auto'}
      p={theme.spacing(3)}
    >
      <Typography gutterBottom marginBottom={2} variant="h2">
        Overview
      </Typography>
      <Grid alignItems="center" container spacing={2}>
        <Grid item xs={3}>
          <Typography variant="h3">Name:</Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography variant="body2">{label}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h3">Status:</Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography
            sx={{
              color: statusColorMap[status],
            }}
            variant="body2"
          >
            {convertStringToCamelCasesWithSpaces(status)}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h3">Type:</Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography variant="body2">{type}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h3">Description:</Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography variant="body2">{description}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h3">Severity:</Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography variant="body2">
            {severity ? severityMap[severity] : severity}
          </Typography>
          {/* todo, maintain a map*/}
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h3">Last Modified:</Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography variant="body2">{formatTimestamp(updated)}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h3">Created By:</Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography variant="body2">{created_by}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h3">Service:</Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography variant="body2">{service_type}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric', // Numeric day (e.g., 20)
    hour: 'numeric', // Numeric hour
    hour12: true, // Use 12-hour clock
    minute: 'numeric', // Numeric minutes
    month: 'short', // Short month name (e.g., Nov)
  };

  const formattedDate = date.toLocaleString('en-US', options);

  return formattedDate + '.';
}
