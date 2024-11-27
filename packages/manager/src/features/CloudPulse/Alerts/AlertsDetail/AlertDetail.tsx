import { Box, Chip, CircleProgress } from '@linode/ui';
import { Grid, styled } from '@mui/material';
import React from 'react';
import { useParams } from 'react-router-dom';

import { Breadcrumb } from 'src/components/Breadcrumb/Breadcrumb';
import { ErrorState } from 'src/components/ErrorState/ErrorState';
import { useAlertDefinitionQuery } from 'src/queries/cloudpulse/alerts';

import { AlertResources } from '../AlertsResources/AlertsResources';
import { AlertDetailCriteria } from './AlertDetailCriteria';
import { AlertDetailNotification } from './AlertDetailNotification';
import { AlertDetailOverview } from './AlertDetailOverview';

interface RouteParams {
  alertId: string;
  serviceType: string;
}

export const AlertDetail = () => {
  const { alertId, serviceType } = useParams<RouteParams>();

  const { data: alertDetails, isError, isFetching } = useAlertDefinitionQuery(
    Number(alertId),
    serviceType
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
            isSelectionsNeeded
            resourceIds={alertDetails?.resource_ids}
            serviceType={alertDetails?.service_type}
          />
        </Grid>
        {/* <Grid item xs={12}>
          <AlertDetailNotification alert={alertDetails} />
        </Grid> */}
      </Grid>
    </>
  );
};

export const StyledAlertsBox = styled(Box, { label: 'StyledAlertsBox' })(
  ({ theme }) => ({
    backgroundColor:
      theme.name === 'light' ? theme.color.grey5 : theme.color.grey9,
    borderRadius: 1,
    height: theme.spacing(90),
    maxHeight: theme.spacing(90),
    maxWidth: theme.spacing(71.75),
    overflow: 'auto',
    width: theme.spacing(71.75),
  })
);

export const StyledAlertChip = styled(Chip, { label: 'StyledAlertChip' })(
  ({ theme }) => ({
    backgroundColor: 'white',
    marginBottom: 0,
    marginLeft: theme.spacing(-1),
    marginTop: 0,
    p: theme.spacing(1),
  })
);
