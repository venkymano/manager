import { Dashboard } from '@linode/api-v4';
import React from 'react';

import CloudViewIcon from 'src/assets/icons/entityIcons/cv_overview.svg';
import { CircleProgress } from 'src/components/CircleProgress';
import { Paper } from 'src/components/Paper';
import { StyledPlaceholder } from 'src/features/StackScripts/StackScriptBase/StackScriptBase.styles';
import { useFlags } from 'src/hooks/useFlags';

import { GlobalFilters } from '../Overview/GlobalFilters';
import { mockFilter } from '../Reusable/MockFilterBuilder';
import { getUserPreference } from '../Utils/UserPreference';
import { CloudPulseWidgetFilters } from '../Widget/CloudViewWidget';
import { CloudPulseDashboard } from './Dashboard';

export const UpdatedDashBoardLanding = () => {
  const [filterValue, setFilterValue] = React.useState<{ [key: string]: any }>(
    {}
  );

  const [dashboard, setDashboard] = React.useState<Dashboard>();
  const [isPrefLoaded, setIsPrefLoaded] = React.useState<boolean>(false);

  const filterReference: { [key: string]: any } = React.useRef({});

  const flags = useFlags();

  const handleGlobalFilterChange = React.useCallback(
    (filterKey: string, value: any) => {
      filterReference.current[filterKey] = value;
      setFilterValue({ ...filterReference.current });
    },
    []
  );

  const dashboardChange = React.useCallback((selectedDashboard: Dashboard) => {
    setDashboard(selectedDashboard);
  }, []);

  const checkIfAllMandatoryFiltersAreSelected = () => {
    flags.aclpServiceTypeFiltersMap = mockFilter();
    if (flags && flags.aclpServiceTypeFiltersMap) {
      const serviceTypeConfig = flags.aclpServiceTypeFiltersMap.find(
        (filterMap) => filterMap.serviceType == dashboard?.service_type
      );

      return serviceTypeConfig?.filters.every((filter) =>
        filterValue[filter.configuration.filterKey] &&
        Array.isArray(filterValue[filter.configuration.filterKey])
          ? filterValue[filter.configuration.filterKey].length > 0
          : true
      );
    }

    return false;
  };

  const getAllFilters = () => {
    flags.aclpServiceTypeFiltersMap = mockFilter();
    const widgetFilters = [];

    if (flags && flags.aclpServiceTypeFiltersMap) {
      const serviceTypeConfig = flags.aclpServiceTypeFiltersMap.find(
        (filterMap) => filterMap.serviceType == dashboard?.service_type
      ) ?? { filters: [] };

      for (let i = 0; i < serviceTypeConfig?.filters.length; i++) {
        if (!serviceTypeConfig.filters[i].configuration.isNonRequestFilter) {
          const widgetFilter = {} as CloudPulseWidgetFilters;
          widgetFilter.filterKey =
            serviceTypeConfig.filters[i].configuration.filterKey;
          widgetFilter.filterValue = filterValue[widgetFilter.filterKey];
          widgetFilter.isDimensionFilter = !serviceTypeConfig.filters[i]
            .configuration.isMetricsFilter;
          widgetFilters.push(widgetFilter);
        }
      }
    }

    return widgetFilters;
  };

  // Fetch the data from preferences
  React.useEffect(() => {
    const fetchPreferences = async () => {
      const userPreference = await getUserPreference();
      setIsPrefLoaded(true);
    };
    fetchPreferences();
  }, []);

  if (!isPrefLoaded) {
    return <CircleProgress></CircleProgress>;
  }

  return (
    <Paper style={{ border: 'solid 1px #e3e5e8' }}>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '100%' }}>
          <GlobalFilters
            handleAnyFilterChange={handleGlobalFilterChange}
            handleDashboardChange={dashboardChange}
          ></GlobalFilters>
        </div>
      </div>
      {dashboard && checkIfAllMandatoryFiltersAreSelected() && (
        <CloudPulseDashboard
          resources={
            filterValue['resource_id']
              ? filterValue['resource_id'].map((obj: any) => obj.toString())
              : undefined
          }
          dashboardId={dashboard.id}
          duration={filterValue['relative_time_duration']}
          manualRefreshTimeStamp={filterValue['timestamp']}
          nonTrivialFilter={getAllFilters()}
          onDashboardChange={dashboardChange}
          region={filterValue['region']}
          // widgetPreferences={fetchUserPrefObject().widgets}
          savePref={true}
        />
      )}

      {(!dashboard || !checkIfAllMandatoryFiltersAreSelected()) && (
        <Paper>
          <StyledPlaceholder
            icon={CloudViewIcon}
            subtitle="Select Dashboard, Region and Resource to visualize metrics"
            title=""
          />
        </Paper>
      )}
    </Paper>
  );
};
