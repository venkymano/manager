import { Grid, styled } from '@mui/material';
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

    const filterReference: { [key: string]: any } = React.useRef({});

    const emitFilterChange = (filterKey: string, value: any) => {
      filterReference.current[filterKey] = value;
      setFilterValue({ ...filterReference.current });
    };

    const StyledPlaceholder = styled(Placeholder, {
      label: 'StyledPlaceholder',
    })({
      flex: 'auto',
    });

    const handleTimeRangeChange = (timeDuration: TimeDuration) => {
      setTimeDuration(timeDuration);
    };

    const checkIfFilterBuilderNeeded = () => {
      if (!dashboard) {
        return false;
      }

      return FILTER_CONFIG.get(dashboard?.service_type)?.filters.some(
        (filterObj) => filterObj.configuration.neededInServicePage
      );
    };

    const renderPlaceHolder = (subtitle: string) => {
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
    };

    const RenderDashboardWithFilter = () => {
      if (!dashboard) {
        return <CircleProgress />;
      } else if (!FILTER_CONFIG.get(dashboard.service_type)) {
        return (
          <ErrorState
            errorText={`No Filters Configured for Service Type - ${dashboard.service_type}`}
          ></ErrorState>
        );
      }

      return (
        <>
          <Paper style={{ border: 'solid 1px #e3e5e8' }}>
            <Grid container>
              <Grid
                item
                lg={12}
                sx={{ marginLeft: '70%', width: '90%' }}
                xs={12}
              >
                <CloudPulseTimeRangeSelect
                  disabled={!dashboard}
                  handleStatsChange={handleTimeRangeChange}
                  savePreferences={true}
                />
              </Grid>
              {checkIfFilterBuilderNeeded() && (
                <CloudPulseDashboardFilterBuilder
                  dashboard={dashboard}
                  emitFilterChange={emitFilterChange}
                  isServiceAnalyticsIntegration={true}
                />
              )}
            </Grid>
          </Paper>
          {checkMandatoryFiltersSelected({
            dashboardObj: dashboard,
            filterValue,
            resource,
            timeDuration,
          }) && (
            <CloudPulseDashboard
              {...getDashboardProperties({
                dashboardObj: dashboard,
                filterValue,
                resource,
                timeDuration,
              })}
            />
          )}
          {!checkMandatoryFiltersSelected({
            dashboardObj: dashboard,
            filterValue,
            resource,
            timeDuration,
          }) && renderPlaceHolder('Mandatory Filters not Selected')}
        </>
      );
    };

    if (isError) {
      return (
        <ErrorState
          errorText={`Error while loading Dashboard with Id -${dashboardId}`}
        ></ErrorState>
      );
    }

    return <RenderDashboardWithFilter />;
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
