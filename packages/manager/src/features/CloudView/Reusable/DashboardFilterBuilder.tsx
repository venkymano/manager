import { TimeDuration } from '@linode/api-v4';
import { Grid } from '@mui/material';
import * as React from 'react';

import { CircleProgress } from 'src/components/CircleProgress';
import { CloudPulseServiceTypeFilters } from 'src/featureFlags';
import { useFlags } from 'src/hooks/useFlags';
import { useCloudViewDashboardByIdQuery } from 'src/queries/cloudview/dashboards';

import { CloudPulseSelectTypes } from '../shared/CloudPulseCustomSelect';
import RenderComponent from './Components';
import { mockFilter } from './MockFilterBuilder';

export interface DashboardWithFilterProps {
  dashboardId: number;
  emitFilterChange: (filterKey: string, value: any) => void;
  // selectedFilters: { [key: string]: string };
}

export const CloudPulseDashboardFilterBuilder = React.memo(
  (props: DashboardWithFilterProps) => {
    const flags = useFlags(); // flags for rendering dynamic global filters

    const { data } = useCloudViewDashboardByIdQuery(
      props.dashboardId,
      undefined
    );

    const [serviceType, setServiceType] = React.useState<string>();

    const [dependentFilters, setDependentFilters] = React.useState<{
      [key: string]: any;
    }>({});

    const dependentFilterReference: { [key: string]: any } = React.useRef({});

    const handleResourceChange = (resourceId: any) => {
      // emitGlobalFilterChange(resourceId?.map((obj) => obj.id) ?? [], RESOURCES);
      props.emitFilterChange('resource_id', resourceId);
      checkAndUpdatedStateIfNeeded('resource_id', resourceId);
    };

    const handleTimeRangeChange = (
      start: number,
      end: number,
      timeDuration?: TimeDuration,
      timeRangeLabel?: string
    ) => {
      props.emitFilterChange('relative_time_duration', timeDuration);
      checkAndUpdatedStateIfNeeded('relative_time_duration', timeDuration);
    };

    const handleRegionChange = (region: string | undefined) => {
      props.emitFilterChange('region', region);
      checkAndUpdatedStateIfNeeded('region', region);
    };

    const checkAndUpdatedStateIfNeeded = (filterkey: string, value: any) => {
      flags.aclpServiceTypeFiltersMap = mockFilter();

      const serviceTypeConfig = flags.aclpServiceTypeFiltersMap?.find(
        (config) => config.serviceType == data?.service_type
      );

      for (
        let i = 0;
        i < (serviceTypeConfig ? serviceTypeConfig?.filters.length : 0);
        i++
      ) {
        const filter = serviceTypeConfig?.filters[i];
        if (
          filter &&
          filter.configuration.dependency &&
          filter.configuration.dependency.length > 0 &&
          filter.configuration.dependency.includes(filterkey)
        ) {
          dependentFilterReference.current[filterkey] = value;
          setDependentFilters({ ...dependentFilterReference.current });
          break;
        }
      }
    };

    const checkIfDisabledNeeded = (filterKey: string, serviceType: string) => {
      flags.aclpServiceTypeFiltersMap = mockFilter();

      const serviceTypeConfig = flags.aclpServiceTypeFiltersMap?.find(
        (config) => config.serviceType == serviceType
      );

      for (
        let i = 0;
        i < (serviceTypeConfig ? serviceTypeConfig?.filters.length : 0);
        i++
      ) {
        const filter = serviceTypeConfig?.filters[i];
        if (
          filter &&
          filter.configuration.filterKey == filterKey &&
          filter.configuration.dependency
        ) {
          return filter.configuration.dependency.some(
            (dependent) =>
              !dependentFilters[dependent] ||
              (Array.isArray(dependentFilters[dependent])
                ? dependentFilters[dependent].length == 0
                : false)
          );
        }
      }

      return false;
    };

    const handleCustomSelectChange = React.useCallback(
      (filterType: string, value: any) => {
        props.emitFilterChange(filterType, value);
      },
      []
    );

    const getPredefinedPropsRegion = (config: CloudPulseServiceTypeFilters) => {
      return {
        componentKey: config.configuration.filterKey,
        filterKey: config.configuration.filterKey,
        handleRegionChange,
        key: config.configuration.filterKey,
        placeholder: config.configuration.placeholder,
        selectedDashboard: data,
        type: CloudPulseSelectTypes.predefined,
      };
    };

    const getPredefinedResources = (config: CloudPulseServiceTypeFilters) => {
      return {
        componentKey: config.configuration.filterKey,
        disabled: checkIfDisabledNeeded(
          'resource_id',
          data ? data.service_type! : undefined!
        ),
        filterKey: config.configuration.filterKey,
        handleResourceChange,
        key: config.configuration.filterKey,
        placeholder: config.configuration.placeholder,
        region: dependentFilters ? dependentFilters['region'] : undefined!,
        resourceType: data?.service_type,
        type: CloudPulseSelectTypes.predefined,
      };
    };

    const getPredefinedTimeDuration = (
      config: CloudPulseServiceTypeFilters
    ) => {
      return {
        componentKey: config.configuration.filterKey,
        filterKey: config.configuration.filterKey,
        handleStatsChange: handleTimeRangeChange,
        key: config.configuration.filterKey,
        placeholder: config.configuration.placeholder,
        type: CloudPulseSelectTypes.predefined,
      };
    };

    const getCustomDropDownProps = (config: CloudPulseServiceTypeFilters) => {
      return {
        apiResponseIdField: config.configuration.apiIdField,
        apiResponseLabelField: config.configuration.apiLabelField,
        componentKey: 'customDropDown',
        dataApiUrl: config.configuration.apiUrl,
        filterKey: config.configuration.filterKey,
        filterType: config.configuration.filterType,
        handleSelectionChange: handleCustomSelectChange,
        isMultiSelect: config.configuration.isMultiSelect,
        key: config.configuration.filterKey,
        maxSelections: config.configuration.maxSelections,
        options: config.configuration.options,
        placeholder: config.configuration.placeholder,
        type: config.configuration.type,
      };
    };

    const getProps = (config: CloudPulseServiceTypeFilters) => {
      if (config.configuration.filterKey == 'region') {
        return getPredefinedPropsRegion(config);
      } else if (config.configuration.filterKey == 'resource_id') {
        return getPredefinedResources(config);
      } else if (config.configuration.filterKey == 'relative_time_duration') {
        return getPredefinedTimeDuration(config);
      } else {
        return getCustomDropDownProps(config);
      }
    };

    if (!data) {
      return <CircleProgress />;
    } else {
      if (data.service_type != serviceType) {
        setServiceType(data.service_type);
      }
    }

    return (
      <>
        {mockFilter().map((filter) => {
          return filter.filters.map((filter, index) => {
            return (
              <Grid
                key={filter.configuration.filterKey}
                sx={{ marginLeft: 2, width: 250 }}
              >
                {RenderComponent({ ...getProps(filter), key: index })}
              </Grid>
            );
          });
        })}
      </>
    );
  },
  (old, newProps) => true
);
