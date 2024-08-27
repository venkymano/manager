import { Divider, Grid, styled } from '@mui/material';
import React from 'react';

import CloudPulseIcon from 'src/assets/icons/entityIcons/monitor.svg';
import { CircleProgress } from 'src/components/CircleProgress';
import { ErrorState } from 'src/components/ErrorState/ErrorState';
import { Paper } from 'src/components/Paper';
import { Placeholder } from 'src/components/Placeholder/Placeholder';
import { useCloudPulseDashboardByIdQuery } from 'src/queries/cloudpulse/dashboards';

import { CloudPulseDashboardFilterBuilder } from '../shared/CloudPulseDashboardFilterBuilder';
import { CloudPulseTimeRangeSelect } from '../shared/CloudPulseTimeRangeSelect';
import { FILTER_CONFIG } from '../Utils/FilterConfig';
import {
  checkMandatoryFiltersSelected,
  getDashboardProperties,
} from '../Utils/ReusableDashboardFilterUtils';
import { CloudPulseDashboard } from './CloudPulseDashboard';

import type { FilterValueType } from './CloudPulseDashboardLanding';
import type { TimeDuration } from '@linode/api-v4';

/**
 * These are the properties required for rendering this resusable component
 */
export interface CloudPulseDashboardWithFiltersProp {
  /**
   * The id of the dashboard that needs to be rendered
   */
  dashboardId: number;
  /**
   * The resource for which the metrics will be listed
   */
  resource: number; // the id of the resources
}

export const CloudPulseDashboardWithFilters = React.memo(
  (props: CloudPulseDashboardWithFiltersProp) => {
    const { dashboardId, resource } = props;
    const { data: dashboard, isError } = useCloudPulseDashboardByIdQuery(
      dashboardId
    );

    const [filterValue, setFilterValue] = React.useState<{
      [key: string]: FilterValueType;
    }>({});

    const [timeDuration, setTimeDuration] = React.useState<TimeDuration>({
      unit: 'min',
      value: 30,
    });

    const emitFilterChange = React.useCallback(
      (filterKey: string, value: any) => {
        setFilterValue((prev) => ({ ...prev, [filterKey]: value }));
      },
      []
    );

    const StyledPlaceholder = styled(Placeholder, {
      label: 'StyledPlaceholder',
    })({
      flex: 'auto',
    });

    const handleTimeRangeChange = React.useCallback(
      (timeDuration: TimeDuration) => {
        setTimeDuration(timeDuration);
      },
      []
    );

    const checkIfFilterBuilderNeeded = React.useCallback(() => {
      if (!dashboard) {
        return false;
      }

      return FILTER_CONFIG.get(dashboard?.service_type)?.filters.some(
        (filterObj) => filterObj.configuration.neededInServicePage
      );
    }, [dashboard]);

    const renderPlaceHolder = React.useCallback((subtitle: string) => {
      return (
        <Paper>
          <StyledPlaceholder
            icon={CloudPulseIcon}
            isEntity
            subtitle={subtitle}
            title=""
          />
        </Paper>
      );
    }, []);

    const renderDashboardContent = React.useCallback(() => {
      if (!dashboard) {
        return <CircleProgress />;
      }

      if (!FILTER_CONFIG.get(dashboard.service_type)) {
        return (
          <ErrorState
            errorText={`No Filters Configured for Service Type - ${dashboard.service_type}`}
          />
        );
      }

      if (isError) {
        return (
          <ErrorState
            errorText={`Error while loading Dashboard with Id -${dashboardId}`}
          />
        );
      }

      return (
        <>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper>
                <Grid container gap={1}>
                  <Grid
                    container
                    item
                    justifyContent="flex-end"
                    mt={2}
                    px={2}
                    rowGap={2}
                    xs={12}
                  >
                    <Grid display="flex" gap={1} item md={4} sm={5} xs={12}>
                      <CloudPulseTimeRangeSelect
                        disabled={!dashboard}
                        handleStatsChange={handleTimeRangeChange}
                        savePreferences={true}
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  {checkIfFilterBuilderNeeded() && (
                    <CloudPulseDashboardFilterBuilder
                      dashboard={dashboard}
                      emitFilterChange={emitFilterChange}
                      isServiceAnalyticsIntegration={true}
                      key="serviceIntegration"
                    />
                  )}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
          {checkMandatoryFiltersSelected({
            dashboardObj: dashboard,
            filterValue,
            resource,
            timeDuration,
          }) ? (
            <CloudPulseDashboard
              {...getDashboardProperties({
                dashboardObj: dashboard,
                filterValue,
                resource,
                timeDuration,
              })}
            />
          ) : (
            renderPlaceHolder('Mandatory Filters not Selected')
          )}
        </>
      );
    }, [
      dashboard,
      isError,
      handleTimeRangeChange,
      checkIfFilterBuilderNeeded,
      emitFilterChange,
      filterValue,
      resource,
      timeDuration,
      renderPlaceHolder,
      dashboardId,
    ]);
    return renderDashboardContent();
  },
  compareProps
);

function compareProps(
  oldProps: CloudPulseDashboardWithFiltersProp,
  newProps: CloudPulseDashboardWithFiltersProp
) {
  return (
    oldProps.dashboardId === newProps.dashboardId &&
    oldProps.resource === newProps.resource
  );
}
