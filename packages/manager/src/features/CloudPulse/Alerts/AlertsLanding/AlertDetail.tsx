import { CircleProgress } from '@linode/ui';
import { Grid } from '@mui/material';
import React from 'react';
import { useParams } from 'react-router-dom';

import { Breadcrumb } from 'src/components/Breadcrumb/Breadcrumb';
import { ErrorState } from 'src/components/ErrorState/ErrorState';
import { useAlertDefinitionQuery } from 'src/queries/cloudpulse/alerts';

import { AlertDetailCriteria } from './AlertDetailCriteria';
import { AlertDetailNotification } from './AlertDetailNotification';
import { AlertDetailOverview } from './AlertDetailOverview';
import { AlertResources } from './AlertsResources';

interface RouteParams {
  alertId: string;
}

export const AlertDetail = () => {
  const { alertId } = useParams<RouteParams>();

  const { data: alertDetails, isError, isFetching } = useAlertDefinitionQuery(
    Number(alertId)
  );

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

  if (isFetching) {
    return <CircleProgress />;
  }

  if (isError || !alertDetails) {
    // TODO, add a error state according to UX
    return <ErrorState errorText={'Error loading alert details.'} />;
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
          <AlertResources
            resourceIds={alertDetails?.resource_ids}
            serviceType={alertDetails?.service_type}
            isSelectionsNeeded
          />
        </Grid>
        <Grid item xs={12}>
          <AlertDetailNotification alert={alertDetails} />
        </Grid>
      </Grid>
    </>
  );
};
