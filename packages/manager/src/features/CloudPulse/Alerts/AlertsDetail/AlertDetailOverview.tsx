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
  /*
   * The alert for which the criteria is displayed
   */
  alert: Alert;
}
export const AlertDetailOverview = (props: OverviewProps) => {
  const { alert } = props;

  const {
    created_by: createdBy,
    description,
    label,
    service_type: serviceType,
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
        <AlertDetailRow label="Description" value={description} />
        <AlertDetailRow
          color={statusColorMap[status]}
          label="Status"
          value={convertStringToCamelCasesWithSpaces(status)}
        />
        <AlertDetailRow
          label="Severity"
          value={severity !== undefined ? severityMap[severity] : severity}
        />
        <AlertDetailRow
          label="Service"
          value={serviceTypes ? getServiceTypeLabel(serviceType) : serviceType}
        />
        <AlertDetailRow
          label="Type"
          value={convertStringToCamelCasesWithSpaces(type)}
        />
        <AlertDetailRow label="Created By" value={createdBy} />
        <AlertDetailRow
          label="Last Modified"
          value={formatTimestamp(updated)}
        />
      </Grid>
    </React.Fragment>
  );
};
