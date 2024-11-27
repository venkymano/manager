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
        <DetailRow label="Name" value={label} />
        <DetailRow
          color={statusColorMap[status]}
          label="Status"
          value={convertStringToCamelCasesWithSpaces(status)}
        />
        <DetailRow label="Type" value={type} />
        <DetailRow label="Description" value={description} />
        <DetailRow
          label="Severity"
          value={severity ? severityMap[severity] : severity || null}
        />
        <DetailRow label="Last Modified" value={formatTimestamp(updated)} />
        <DetailRow label="Created By" value={created_by} />
        <DetailRow label="Service" value={service_type} />
      </Grid>
    </Box>
  );
};

const DetailRow = ({
  color,
  label,
  value,
}: {
  color?: string;
  label: string;
  value: null | string;
}) => (
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
