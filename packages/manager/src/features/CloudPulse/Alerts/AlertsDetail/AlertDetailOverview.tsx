import { CircleProgress } from '@linode/ui';
import { Grid, Typography, useTheme } from '@mui/material';
import React from 'react';

import { useCloudPulseServiceTypes } from 'src/queries/cloudpulse/services';

import { convertStringToCamelCasesWithSpaces } from '../../Utils/utils';
import { severityMap } from '../constants';
import { formatTimestamp } from '../Utils/utils';
import { StyledAlertsBox } from './AlertDetail';
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

  const {
    data: servriceTypes,
    isError,
    isFetching,
  } = useCloudPulseServiceTypes(true);

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
    if (!servriceTypes) {
      return serviceType;
    }

    for (const service of servriceTypes?.data) {
      if (service.service_type === serviceType) {
        return service.label;
      }
    }

    return serviceType;
  };

  return (
    // <StyledAlertsBox>
    <React.Fragment>
      <Typography gutterBottom marginBottom={2} variant="h2">
        Overview
      </Typography>
      <Grid alignItems="center" container spacing={3}>
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
        <AlertOverviewDetailRow
          value={
            servriceTypes ? getServiceTypeLabel(service_type) : service_type
          }
          label="Service"
        />
      </Grid>
    </React.Fragment>
  );
};
