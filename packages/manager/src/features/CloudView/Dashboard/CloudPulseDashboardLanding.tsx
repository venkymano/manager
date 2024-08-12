import { Dashboard } from '@linode/api-v4';
import React from 'react';

import CloudViewIcon from 'src/assets/icons/Monitor.svg';
import { CircleProgress } from 'src/components/CircleProgress';
import { Paper } from 'src/components/Paper';
import { StyledPlaceholder } from 'src/features/StackScripts/StackScriptBase/StackScriptBase.styles';

import { GlobalFilters } from '../Overview/GlobalFilters';
import { FILTER_CONFIG } from '../Utils/FilterConfig';
import { getUserPreference } from '../Utils/UserPreference';
import { CloudPulseWidgetFilters } from '../Widget/CloudViewWidget';
import { CloudPulseDashboard } from './Dashboard';

export const CloudPulseDashboardLanding = () => {
  const [filterValue, setFilterValue] = React.useState<{ [key: string]: any }>(
    {}
  );

  const [dashboard, setDashboard] = React.useState<Dashboard>();
  const [isPrefLoaded, setIsPrefLoaded] = React.useState<boolean>(false);

  const filterReference: { [key: string]: any } = React.useRef({});

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
    if (FILTER_CONFIG && FILTER_CONFIG.get(dashboard!.service_type!)) {
      const serviceTypeConfig = FILTER_CONFIG.get(dashboard!.service_type!);

      for (let i = 0; i < serviceTypeConfig!.filters.length; i++) {
        if (
          filterValue[serviceTypeConfig!.filters[i].configuration.filterKey] ==
            undefined ||
          (Array.isArray(
            filterValue[serviceTypeConfig!.filters[i].configuration.filterKey]
          ) &&
            filterValue[serviceTypeConfig!.filters[i].configuration.filterKey]
              .length == 0)
        ) {
          return false;
        }
      }

      return true;
    }

    return false;
  };

  const getAllFilters = () => {
    const widgetFilters = [];

    if (FILTER_CONFIG && FILTER_CONFIG.get(dashboard!.service_type!)) {
      const serviceTypeConfig = FILTER_CONFIG.get(dashboard!.service_type!);

      for (let i = 0; i < serviceTypeConfig!.filters.length; i++) {
        if (serviceTypeConfig!.filters[i].configuration.isFilterable) {
          const widgetFilter = {} as CloudPulseWidgetFilters;
          widgetFilter.filterKey = serviceTypeConfig!.filters[
            i
          ].configuration.filterKey;
          widgetFilter.filterValue = filterValue[widgetFilter.filterKey];
          widgetFilter.isDimensionFilter = !serviceTypeConfig!.filters[i]
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
    <>
      <Paper style={{ border: 'solid 1px #e3e5e8' }}>
        <div style={{ display: 'flex' }}>
          <div style={{ width: '100%' }}>
            <GlobalFilters
              handleAnyFilterChange={handleGlobalFilterChange}
              handleDashboardChange={dashboardChange}
            ></GlobalFilters>
          </div>
        </div>
      </Paper>
      {dashboard && !FILTER_CONFIG.get(dashboard.service_type) && (
        <Paper>
          <StyledPlaceholder
            icon={CloudViewIcon}
            isEntity
            subtitle="No Filters Configured for selected dashboard's service type"
            title=""
          />
        </Paper>
      )}
      {(!dashboard ||
        (FILTER_CONFIG.get(dashboard.service_type) &&
          !checkIfAllMandatoryFiltersAreSelected())) && (
        <Paper>
          <StyledPlaceholder
            icon={CloudViewIcon}
            isEntity
            subtitle="Select Dashboard and filters  to visualize metrics."
            title=""
          />
        </Paper>
      )}
      {dashboard && checkIfAllMandatoryFiltersAreSelected() && (
        <CloudPulseDashboard
          resources={
            filterValue['resource_id']
              ? filterValue['resource_id'].map((obj: any) => obj.toString())
              : undefined
          }
          dashboardId={dashboard.id}
          duration={filterValue['relative_time_duration']}
          globalFilters={getAllFilters()}
          manualRefreshTimeStamp={filterValue['timestamp']}
          onDashboardChange={dashboardChange}
          // widgetPreferences={fetchUserPrefObject().widgets}
          savePref={true}
        />
      )}
    </>
  );
};
