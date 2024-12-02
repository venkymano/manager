import { Chip, CircleProgress } from '@linode/ui';
import { Grid, styled, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import { useParams } from 'react-router-dom';

import EntityIcon from 'src/assets/icons/entityIcons/alert.svg';
import { Breadcrumb } from 'src/components/Breadcrumb/Breadcrumb';
import { ErrorState } from 'src/components/ErrorState/ErrorState';
import { Placeholder } from 'src/components/Placeholder/Placeholder';
import { useAlertDefinitionQuery } from 'src/queries/cloudpulse/alerts';

import { AlertDetailOverview } from './AlertDetailOverview';

import type { BreadcrumbProps } from 'src/components/Breadcrumb/Breadcrumb';

interface RouteParams {
  /*
   * The id of the alert for which the data needs to be shown
   */
  alertId: string;
  /*
   * The service type like linode, dbaas etc., of the the alert for which the data needs to be shown
   */
  serviceType: string;
}

export const AlertDetail = () => {
  const { alertId, serviceType } = useParams<RouteParams>();

  const { data: alertDetails, isError, isFetching } = useAlertDefinitionQuery(
    Number(alertId),
    serviceType
  );

  const { crumbOverrides, pathname } = React.useMemo((): BreadcrumbProps => {
    const overrides = [
      {
        label: 'Definitions',
        linkTo: '/monitor/alerts/definitions',
        position: 1,
      },
      {
        label: 'Details',
        linkTo: `/monitor/alerts/definitions/details/${serviceType}/${alertId}`,
        position: 2,
      },
    ];
    return { crumbOverrides: overrides, pathname: '/Definitions/Details' };
  }, [alertId, serviceType]);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const flexWrap = isSmallScreen ? 'wrap' : 'nowrap';

  if (isFetching) {
    return <CircleProgress />;
  }

  if (isError) {
    return (
      <>
        <Breadcrumb crumbOverrides={crumbOverrides} pathname={pathname} />
        <ErrorState errorText={'Error loading alert details.'} />
      </>
    );
  }

  if (!alertDetails) {
    return (
      <>
        <Breadcrumb crumbOverrides={crumbOverrides} pathname={pathname} />
        <Placeholder icon={EntityIcon} title="No Data to display." />
      </>
    );
  }

  return (
    <React.Fragment>
      <Breadcrumb crumbOverrides={crumbOverrides} pathname={pathname} />
      <Grid container gap={2}>
        <Grid container flexWrap={flexWrap} gap={2} item>
          <StyledAlertsGrid item maxHeight={theme.spacing(90.5)} md={6} xs={12}>
            <AlertDetailOverview alert={alertDetails} />
          </StyledAlertsGrid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export const StyledAlertsGrid = styled(Grid, { label: 'StyledAlertsGrid' })(
  ({ theme }) => ({
    backgroundColor:
      theme.name === 'light' ? theme.color.grey5 : theme.color.grey9,
    overflow: 'auto',
    padding: theme.spacing(3),
  })
);

export const StyledAlertChip = styled(Chip, {
  label: 'StyledAlertChip',
  shouldForwardProp: (prop) => prop !== 'borderRadius',
})<{
  borderRadius?: string;
}>(({ borderRadius, theme }) => ({
  '& .MuiChip-label': {
    padding: theme.spacing(2), // Add padding inside the label
  },
  backgroundColor: 'white',
  borderRadius: borderRadius || 0,
}));
