import { Grid } from '@mui/material';
import React from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';

import type { Alert } from '@linode/api-v4';
import { AlertDetailOverview } from './AlertDetailOverview';
import { AlertDetailCriteria } from './AlertDetailCriteria';

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

  if (!alertDetails && alertId) {
    history.push('/monitor/cloudpulse/alerts/definitions');
    return null;
  }

  return (
    <Grid container spacing={2}>
      <Grid item md={6}>
        <AlertDetailOverview alert={alertDetails}/>
      </Grid>
      <Grid item md={6}>
        <AlertDetailCriteria alert={alertDetails}/>
      </Grid>
      <Grid item md={12}>
        <p>rewr</p>
      </Grid>
    </Grid>
  );
};
