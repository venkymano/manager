import { FILTER_CONFIG } from './FilterConfig';

import type { DashboardProperties } from '../Dashboard/CloudPulseDashboard';
import type { FilterValueType } from '../Dashboard/CloudPulseDashboardLanding';
import type { CloudPulseMetricsAdditionalFilters } from '../Widget/CloudPulseWidget';
import type { Dashboard, TimeDuration } from '@linode/api-v4';

/**
 * These properties are used as a method parameters for this utility
 */
interface ReusableDashboardFilterUtilProps {
  /**
   * The selected dashboard object
   */
  dashboardObj: Dashboard;
  /**
   * The selected filter values
   */
  filterValue: { [key: string]: FilterValueType };
  /**
   * The selected resource id
   */
  resource: number;
  /**
   * The selected time duration
   */
  timeDuration?: TimeDuration;
}

/**
 *
 * @param props The props required for constructing the dashboard properties
 * @returns The properties compatible for rendering dashboard component
 */
export const getDashboardProperties = (
  props: ReusableDashboardFilterUtilProps
): DashboardProperties => {
  const { dashboardObj, filterValue, resource, timeDuration } = props;
  const timeDurationObj: TimeDuration = {
    unit: 'min',
    value: 30,
  };
  const dashboardProps: DashboardProperties = {
    dashboardId: 0,
    duration: timeDuration ?? timeDurationObj,
    resources: [String(resource)],
    savePref: false,
  };

  // fill up required properties
  dashboardProps.dashboardId = dashboardObj.id;
  dashboardProps.additionalFilters = constructDimensionFilters({
    dashboardObj,
    filterValue,
    resource,
  });

  return dashboardProps;
};

/**
 *
 * @param props The props required for constructing the dashboard properties
 * @returns True if all mandatory filters are selected for a given service type , else false
 */
export const checkMandatoryFiltersSelected = (
  props: ReusableDashboardFilterUtilProps
) => {
  const { dashboardObj, filterValue, resource, timeDuration } = props;
  const serviceTypeConfig = FILTER_CONFIG.get(dashboardObj.service_type);
  if (!timeDuration || !resource) {
    return false;
  }

  return serviceTypeConfig?.filters.every(
    (filterObj) =>
      !filterObj.configuration.neededInServicePage ||
      (filterValue[filterObj.configuration.filterKey] !== undefined &&
        ((Array.isArray(filterValue[filterObj.configuration.filterKey]) &&
          Boolean(Array.of(filterValue[filterObj.configuration.filterKey]))) ||
          true)) ||
      (filterObj.configuration.filterKey === 'resource_ids' && resource)
  );
};

/**
 *
 * @param filterKey The current filterKey for which the check needs to made against the config
 * @param serviceType The serviceType of the selected dashboard
 * @returns True, if the filter is needed in the metrics call, else false
 */
export const checkIfFilterNeededInMetricsCall = (
  filterKey: string,
  serviceType: string
) => {
  const serviceTypeConfig = FILTER_CONFIG.get(serviceType);

  return serviceTypeConfig
    ? serviceTypeConfig?.filters.findIndex(
        (filterObj) =>
          filterObj &&
          filterObj.configuration.filterKey === filterKey &&
          Boolean(filterObj.configuration.isFilterable) &&
          filterObj.configuration.neededInServicePage // this indicates whether we need to send this as a filter or not
      ) > -1
    : false;
};

/**
 *
 * @param props The props required for constructing the dashboard properties
 * @returns Array of additional filters to be passed in the metrics api call
 */
export const constructDimensionFilters = (
  props: ReusableDashboardFilterUtilProps
) => {
  const { dashboardObj, filterValue } = props;
  const keys = Object.keys(filterValue);
  const dimensionFilters: CloudPulseMetricsAdditionalFilters[] = [];
  for (let i = 0; i < keys.length; i++) {
    if (checkIfFilterNeededInMetricsCall(keys[i], dashboardObj.service_type)) {
      dimensionFilters.push({
        filterKey: keys[i],
        filterValue: filterValue[keys[i]],
      });
    }
  }

  return dimensionFilters;
};
