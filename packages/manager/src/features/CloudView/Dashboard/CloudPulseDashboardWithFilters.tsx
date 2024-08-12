import { Grid, styled } from '@mui/material';
import React from 'react';

import CloudViewIcon from 'src/assets/icons/Monitor.svg';
import { CircleProgress } from 'src/components/CircleProgress';
import { ErrorState } from 'src/components/ErrorState/ErrorState';
import { Paper } from 'src/components/Paper';
import { Placeholder } from 'src/components/Placeholder/Placeholder';
import { useCloudViewDashboardByIdQuery } from 'src/queries/cloudview/dashboards';

import { CloudPulseDashboardFilterBuilder } from '../shared/CloudPulseDashboardFilterBuilder';
import { FILTER_CONFIG } from '../Utils/FilterConfig';
import { CloudPulseWidgetFilters } from '../Widget/CloudViewWidget';
import { CloudPulseDashboard, DashboardProperties } from './Dashboard';
import { CloudPulseTimeRangeSelect } from '../shared/TimeRangeSelect';
import { TimeDuration } from '@linode/api-v4';

export interface CloudPulseDashboardWithFiltersProp {
  dashboardId: number;
  resource: number; // the id of the resources
}

export const CloudPulseDashboardWithFilters = React.memo(
  (props: CloudPulseDashboardWithFiltersProp) => {
    const { data: dashboard, isError } = useCloudViewDashboardByIdQuery(
      props.dashboardId,
      undefined
    );

    const [filterValue, setFilterValue] = React.useState<{
      [key: string]: any;
    }>({});

    const filterReference: { [key: string]: any } = React.useRef({});

    const emitFilterChange = (filterKey: string, value: any) => {
      filterReference.current[filterKey] = value;
      setFilterValue({ ...filterReference.current });
    };

    const getDashboardProperties = (): DashboardProperties => {
      const dashboardProps: DashboardProperties = {
        dashboardId: 0,
        duration: undefined!,
        resources: [],
      };

      // fill up required properties
      dashboardProps.dashboardId = props.dashboardId;
      dashboardProps.globalFilters = constructDimesionFilters();
      dashboardProps.savePref = false; // no need to save pref

      return dashboardProps;
    };

    const checkMandatoryFiltersSelected = () => {
      const serviceTypeConfig = FILTER_CONFIG.get(dashboard!.service_type!);

      return serviceTypeConfig?.filters.every(
        (filterObj) =>
          !filterObj.configuration.neededInServicePage ||
          (filterValue[filterObj.configuration.filterKey] != undefined &&
            (Array.isArray(filterValue[filterObj.configuration.filterKey])
              ? filterValue[filterObj.configuration.filterKey].length > 0
              : true)) ||
          (filterObj.configuration.filterKey == 'resource_id' &&
            props.resources &&
            props.resources.length > 0)
      );
    };

    const checkIfDimensionFilter = (filterKey: string) => {
      const serviceTypeConfig = FILTER_CONFIG.get(dashboard!.service_type!);

      return serviceTypeConfig
        ? serviceTypeConfig?.filters.findIndex(
            (filterObj) =>
              filterObj &&
              filterObj.configuration.filterKey == filterKey &&
              !filterObj.configuration.isMetricsFilter
          ) > -1
        : false;
    };

    const checkIfFilterNeededInMetricsCall = (filterKey: string) => {
      const serviceTypeConfig = FILTER_CONFIG.get(dashboard!.service_type!);

      return serviceTypeConfig
        ? serviceTypeConfig?.filters.findIndex(
            (filterObj) =>
              filterObj &&
              filterObj.configuration.filterKey == filterKey &&
              filterObj.configuration.isFilterable // this indicates whether we need to send this as a filter or not
          ) > -1
        : false;
    };

    const constructDimesionFilters = () => {
      const keys = Object.keys(filterValue);
      const dimensionFilters: CloudPulseWidgetFilters[] = [];
      for (let i = 0; i < keys.length; i++) {
        if (checkIfFilterNeededInMetricsCall(keys[i])) {
          dimensionFilters.push({
            filterKey: keys[i],
            filterValue: filterValue[keys[i]],
            isDimensionFilter: checkIfDimensionFilter(keys[i]),
          });
        }
      }

      // push passed resource
      dimensionFilters.push({
        filterKey: 'resource_id',
        filterValue: [props.resource],
        isDimensionFilter: false,
      });

      return dimensionFilters;
    };

    const StyledPlaceholder = styled(Placeholder, {
      label: 'StyledPlaceholder',
    })({
      flex: 'auto',
    });

    const handleTimeRangeChange = (
      start: number,
      end: number,
      timeDuration?: TimeDuration,
      timeRangeLabel?: string
    ) => {
      emitFilterChange('relative_time_duration', timeDuration);
    };

    const checkIfFilterBuilderNeeded = () => {

      if(!dashboard) {
        return false;
      }

      return FILTER_CONFIG.get(dashboard?.service_type)?.filters
            .some(filterObj => filterObj.configuration.neededInServicePage)
    }

    const renderPlaceHolder = (subtitle: string) => {
      return (
        <Paper>
          <StyledPlaceholder
            icon={CloudViewIcon}
            isEntity
            subtitle={subtitle}
            title=""
          />
        </Paper>
      );
    };

    if (!dashboard) {
      return <CircleProgress />;
    } else if (!FILTER_CONFIG.get(dashboard.service_type)) {
      return (
        <ErrorState
          errorText={`No Filters Configured for Service Type - ${dashboard.service_type}`}
        ></ErrorState>
      );
    }

    if (isError) {
      return (
        <ErrorState
          errorText={`Error while loading Dashboard with Id -${props.dashboardId}`}
        ></ErrorState>
      );
    }

    return (
      <>
        <Paper style={{ border: 'solid 1px #e3e5e8' }}>
          <Grid container>
          <Grid sx={{ marginLeft: '70%', width: '90%' }} lg={12} xs={12}>
              <CloudPulseTimeRangeSelect
                disabled={!dashboard}
                handleStatsChange={handleTimeRangeChange}
                savePreferences={true}
              />
          </Grid>            
            {checkIfFilterBuilderNeeded() && <CloudPulseDashboardFilterBuilder
              dashboard={dashboard}
              emitFilterChange={emitFilterChange}
              isServiceAnalyticsIntegration={true}
            />}
          </Grid>
        </Paper>
        {checkMandatoryFiltersSelected() && (
          <CloudPulseDashboard {...getDashboardProperties()} />
        )}
        {!checkMandatoryFiltersSelected() &&
          renderPlaceHolder('Mandatory Filters not Selected')}
      </>
    );
  },
  compareProps
);

function compareProps(
  oldProps: CloudPulseDashboardWithFiltersProp,
  newProps: CloudPulseDashboardWithFiltersProp
) {
  return (
    oldProps.dashboardId == newProps.dashboardId &&
    oldProps.resource == newProps.resource
  );
}
