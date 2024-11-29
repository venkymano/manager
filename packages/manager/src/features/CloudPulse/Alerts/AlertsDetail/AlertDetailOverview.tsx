import { CircleProgress } from '@linode/ui';
import { Grid, Typography, useTheme } from '@mui/material';
import React from 'react';

import { useCloudPulseServiceTypes } from 'src/queries/cloudpulse/services';

import { convertStringToCamelCasesWithSpaces } from '../../Utils/utils';
import { severityMap } from '../constants';
import { formatTimestamp } from '../Utils/utils';
import { AlertDetailRow } from './AlertDetailRow';

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

  const { data: serviceTypes, isFetching } = useCloudPulseServiceTypes(true);

  const theme = useTheme();

  const statusColorMap = {
    disabled: theme.color.grey1,
    enabled: theme.color.green,
    failed: theme.color.red,
    provisioning: theme.color.orange,
  };

  if (isFetching) {
    return <CircleProgress />;
  }

  const getServiceTypeLabel = (serviceType: string) => {
    // TODO: this can be moved to util
    if (!serviceTypes) {
      return serviceType;
    }

    for (const service of serviceTypes?.data) {
      if (service.service_type === serviceType) {
        return service.label;
      }
    }

    return serviceType;
  };

  return (
    <React.Fragment>
      <Typography
        fontSize={theme.spacing(2.25)}
        gutterBottom
        marginBottom={2}
        variant="h2"
      >
        Overview
      </Typography>
      <Grid alignItems="center" container spacing={2}>
        <AlertDetailRow label="Name" value={label} />
        <AlertDetailRow
          color={statusColorMap[status]}
          label="Status"
          value={convertStringToCamelCasesWithSpaces(status)}
        />
        <AlertDetailRow label="Type" value={type} />
        <AlertDetailRow label="Description" value={description} />
        <AlertDetailRow
          label="Severity"
          value={severity ? severityMap[severity] : severity || null}
        />
        <AlertDetailRow
          label="Last Modified"
          value={formatTimestamp(updated)}
        />
        <AlertDetailRow label="Created By" value={created_by} />
        <AlertDetailRow
          value={
            serviceTypes ? getServiceTypeLabel(service_type) : service_type
          }
          label="Service"
        />
      </Grid>
    </React.Fragment>
  );
};
