import { Box } from '@linode/ui';
import { Grid, Typography, useTheme } from '@mui/material';
import React from 'react';

import { convertStringToCamelCasesWithSpaces } from '../../Utils/utils';
import { severityMap } from '../constants';
import { formatTimestamp } from '../Utils/utils';
import { AlertOverviewDetailRow } from './AlertDetailOverviewRow';

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
        <AlertOverviewDetailRow label="Name" value={label} />
        <AlertOverviewDetailRow
          color={statusColorMap[status]}
          label="Status"
          value={convertStringToCamelCasesWithSpaces(status)}
        />
        <AlertOverviewDetailRow label="Type" value={type} />
        <AlertOverviewDetailRow label="Description" value={description} />
        <AlertOverviewDetailRow
          label="Severity"
          value={severity ? severityMap[severity] : severity || null}
        />
        <AlertOverviewDetailRow
          label="Last Modified"
          value={formatTimestamp(updated)}
        />
        <AlertOverviewDetailRow label="Created By" value={created_by} />
        <AlertOverviewDetailRow label="Service" value={service_type} />
      </Grid>
    </Box>
  );
};
