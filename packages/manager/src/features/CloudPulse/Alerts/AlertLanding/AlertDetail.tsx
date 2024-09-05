import { Grid } from '@mui/material';
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Breadcrumb } from 'src/components/Breadcrumb/Breadcrumb';

import { AlertDetailCriteria } from './AlertDetailCriteria';
import { AlertDetailNotification } from './AlertDetailNotification';
import { AlertDetailOverview } from './AlertDetailOverview';

import type { Alert } from '@linode/api-v4';

interface AlertDetailProps {
  alerts?: Alert[];
}
interface RouteParams {
  alertId: string;
}

export const AlertDetail = (props: AlertDetailProps) => {
  const { alerts } = props;
  const { alertId } = useParams<RouteParams>();
  const history = useHistory();

  const alertDetails =
    alerts && alerts.length > 0
      ? alerts.find((alert) => alert.id === alertId)
      : null;

  const generateCrumbOverrides = () => {
    const overrides = [
      {
        label: 'Definitions',
        linkTo: '/monitor/cloudpulse/alerts/definitions',
        position: 1,
      },
      {
        label: 'Details',
        linkTo: `/monitor/cloudpulse/alerts/definitions/details/${alertId}`,
        position: 2,
      },
    ];

    return { newPathname: '/Definitions/Details', overrides };
  };

  const { newPathname, overrides } = React.useMemo(
    () => generateCrumbOverrides(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (!alertDetails && alertId) {
    history.push('/monitor/cloudpulse/alerts/definitions');
    return null;
  }

  return (
    <>
      <Breadcrumb crumbOverrides={overrides} pathname={newPathname} />
      <Grid container spacing={2}>
        <Grid item md={6} xs={12}>
          <AlertDetailOverview alert={alertDetails} />
        </Grid>
        <Grid item md={6} xs={12}>
          <AlertDetailCriteria alert={alertDetails} />
        </Grid>
        <Grid item xs={12}>
          <AlertDetailNotification alert={alertDetails} />
        </Grid>
      </Grid>
    </>
  );
};
