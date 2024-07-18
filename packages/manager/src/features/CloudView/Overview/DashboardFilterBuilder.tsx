import { Dashboard, TimeDuration } from '@linode/api-v4';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Grid, Typography } from '@mui/material';
import * as React from 'react';

import { Button } from 'src/components/Button/Button';
import { CircleProgress } from 'src/components/CircleProgress';
import { CloudPulseServiceTypeFilters } from 'src/featureFlags';

import RenderComponent from '../shared/CloudPulseComponentRenderer';
import { CloudPulseSelectTypes } from '../shared/CloudPulseCustomSelect';
import { FILTER_CONFIG } from '../Utils/FilterConfig';

export interface DashboardWithFilterProps {
  dashboard: Dashboard;
  emitFilterChange: (filterKey: string, value: any) => void;
  serviceAnalyticsIntegration: boolean;
}

export const CloudPulseDashboardFilterBuilder = React.memo(
  (props: DashboardWithFilterProps) => {
    const [serviceType, setServiceType] = React.useState<string>();

    const [dependentFilters, setDependentFilters] = React.useState<{
      [key: string]: any;
    }>({});

    const [showFilter, setShowFilter] = React.useState<boolean>(true);

    const dependentFilterReference: { [key: string]: any } = React.useRef({});

    const handleResourceChange = (resourceId: any) => {
      props.emitFilterChange('resource_id', resourceId);
      checkForAndUpdateState('resource_id', resourceId);
    };

    const handleTimeRangeChange = (
      start: number,
      end: number,
      timeDuration?: TimeDuration,
      timeRangeLabel?: string
    ) => {
      props.emitFilterChange('relative_time_duration', timeDuration);
      checkForAndUpdateState('relative_time_duration', timeDuration);
    };

    const handleRegionChange = (region: string | undefined) => {
      props.emitFilterChange('region', region);
      checkForAndUpdateState('region', region);
    };

    const checkForAndUpdateState = (filterkey: string, value: any) => {
      const serviceTypeConfig = FILTER_CONFIG.get(
        props.dashboard.service_type!
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

    const checkIfDisabledNeeded = (filterKey: string) => {
      const serviceTypeConfig = FILTER_CONFIG.get(
        props.dashboard.service_type!
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

    const handleCustomSelectChange = (filterType: string, value: any) => {
      props.emitFilterChange(filterType, value);
      checkForAndUpdateState(filterType, value);
    };

    const getRegionProperties = (config: CloudPulseServiceTypeFilters) => {
      return {
        componentKey: config.configuration.filterKey,
        filterKey: config.configuration.filterKey,
        handleRegionChange,
        key: config.configuration.filterKey,
        placeholder: config.configuration.placeholder,
        savePreferences: !props.serviceAnalyticsIntegration,
        selectedDashboard: props.dashboard,
        type: CloudPulseSelectTypes.predefined,
      };
    };

    const getResourcesProperties = (config: CloudPulseServiceTypeFilters) => {
      return {
        componentKey: config.configuration.filterKey,
        disabled: checkIfDisabledNeeded(config.configuration.filterKey),
        filterKey: config.configuration.filterKey,
        handleResourceChange,
        key: config.configuration.filterKey,
        placeholder: config.configuration.placeholder,
        resourceType: props.dashboard?.service_type,
        savePreferences: !props.serviceAnalyticsIntegration,
        type: CloudPulseSelectTypes.predefined,
        xFilter: buildXFilter(config),
      };
    };

    const buildXFilter = (config: CloudPulseServiceTypeFilters) => {
      const xFilterObj: any = {};

      if (config.configuration.dependency) {
        for (let i = 0; i < config.configuration.dependency.length; i++) {
          xFilterObj[config.configuration.dependency[i]] =
            dependentFilters[config.configuration.dependency[i]];
        }
      }

      return xFilterObj;
    };

    const getTimeDurationProperties = (
      config: CloudPulseServiceTypeFilters
    ) => {
      return {
        componentKey: config.configuration.filterKey,
        filterKey: config.configuration.filterKey,
        handleStatsChange: handleTimeRangeChange,
        key: config.configuration.filterKey,
        placeholder: config.configuration.placeholder,
        savePreferences: !props.serviceAnalyticsIntegration,
        type: CloudPulseSelectTypes.predefined,
      };
    };

    const getCustomSelectProperties = (
      config: CloudPulseServiceTypeFilters
    ) => {
      return {
        apiResponseIdField: config.configuration.apiIdField,
        apiResponseLabelField: config.configuration.apiLabelField,
        componentKey: 'customDropDown', // needed for renderer to choose the component
        dataApiUrl: config.configuration.apiUrl,
        filterKey: config.configuration.filterKey,
        filterType: config.configuration.filterType,
        handleSelectionChange: handleCustomSelectChange,
        isMultiSelect: config.configuration.isMultiSelect,
        key: config.configuration.filterKey,
        maxSelections: config.configuration.maxSelections,
        options: config.configuration.options,
        placeholder: config.configuration.placeholder,
        savePreferences: !props.serviceAnalyticsIntegration,
        type: config.configuration.type,
      };
    };

    const getProps = (config: CloudPulseServiceTypeFilters) => {
      if (config.configuration.filterKey == 'region') {
        return getRegionProperties(config);
      } else if (config.configuration.filterKey == 'resource_id') {
        return getResourcesProperties(config);
      } else if (config.configuration.filterKey == 'relative_time_duration') {
        return getTimeDurationProperties(config);
      } else {
        return getCustomSelectProperties(config); // if the above doesn't match use out custom select for rendering filters
      }
    };

    const toggleShowFilter = () => {
      setShowFilter((showFilterPrev) => !showFilterPrev);
    };

    if (!props.dashboard) {
      return <CircleProgress />;
    } else {
      if (props.dashboard.service_type != serviceType) {
        setServiceType(props.dashboard.service_type);
      }
    }

    return (
      <>
        {!showFilter && (
          <Button
            key={'right'}
            onClick={toggleShowFilter}
            sx={{ marginTop: 2 }}
          >
            <KeyboardArrowRightIcon />
            <Typography>Filters</Typography>
          </Button>
        )}
        {showFilter && (
          <Button key={'down'} onClick={toggleShowFilter} sx={{ marginTop: 2 }}>
            <KeyboardArrowDownIcon />
            <Typography>Filters</Typography>
          </Button>
        )}
        {showFilter &&
          FILTER_CONFIG.get(props.dashboard.service_type)
            ?.filters.filter((config) =>
              !props.serviceAnalyticsIntegration
                ? config.configuration.filterKey != 'relative_time_duration'
                : config.configuration.neededInServicePage
            )
            .map((filter, index) => {
              if (index % 3 == 0) {
                return (
                  <>
                    <div style={{ width: '100%' }}></div>
                    <Grid
                      key={filter.configuration.filterKey}
                      sx={{ marginLeft: 2 }}
                      xs
                    >
                      {RenderComponent({ ...getProps(filter), key: index })}
                    </Grid>
                  </>
                );
              }
              return (
                <Grid
                  key={filter.configuration.filterKey}
                  sx={{ marginLeft: 2 }}
                  xs
                >
                  {RenderComponent({ ...getProps(filter), key: index })}
                </Grid>
              );
            })}
      </>
    );
  },
  (old, newProps) =>
    old.dashboard.id == newProps.dashboard.id &&
    !newProps.serviceAnalyticsIntegration
);
