import {
  CloudPulseServiceTypeFilterMap,
  CloudPulseServiceTypeFilters,
  CloudPulseServiceTypeFiltersConfiguration,
} from 'src/featureFlags';

import { CloudPulseSelectTypes } from '../shared/CloudPulseCustomSelect';

export const mockFilter = (): CloudPulseServiceTypeFilterMap[] => {
  const linodeServiceTypeMap: CloudPulseServiceTypeFilterMap[] = [];

  const linodeFilterMap: CloudPulseServiceTypeFilterMap = {} as CloudPulseServiceTypeFilterMap;
  linodeFilterMap.serviceType = 'linode';
  linodeFilterMap.filters = [];
  linodeFilterMap.filters.push(getFilter());
  linodeFilterMap.filters.push(getDynamicTypeFilter());
  linodeFilterMap.filters.push(getPredefinedFilterRegion());
  linodeFilterMap.filters.push(getPredefinedFilter());
  linodeFilterMap.filters.push(getPredefinedFilterTimeDuration());

  linodeServiceTypeMap.push(linodeFilterMap);

  return linodeServiceTypeMap;
};

const getFilter = () => {
  const filter: CloudPulseServiceTypeFilters = {} as CloudPulseServiceTypeFilters;
  filter.configuration = {} as CloudPulseServiceTypeFiltersConfiguration;
  filter.name = 'Custom Filter';
  filter.configuration.name = 'Custom Filter';
  filter.configuration.filterKey = 'CustomFilter';
  filter.configuration.filterType = 'string';
  filter.configuration.type = CloudPulseSelectTypes.static;
  filter.configuration.options = [
    {
      id: 'filter1',
      label: 'Filter 1',
    },
    {
      id: 'filter2',
      label: 'Filter 2',
    },
    {
      id: 'filter3',
      label: 'Filter 3',
    },
  ];
  filter.configuration.placeholder = 'Select a Filter';
  filter.configuration.isMultiSelect = false;
  filter.configuration.isNonRequestFilter = false;

  return filter;
};

const getDynamicTypeFilter = () => {
  const filter: CloudPulseServiceTypeFilters = {} as CloudPulseServiceTypeFilters;
  filter.configuration = {} as CloudPulseServiceTypeFiltersConfiguration;
  filter.name = 'DB Engine API';
  filter.configuration.filterKey = 'dbEngine';
  filter.configuration.type = CloudPulseSelectTypes.dynamic;
  filter.configuration.filterType = 'string';
  filter.configuration.apiUrl =
    'https://blr-lhv95n.bangalore.corp.akamai.com:9000/v4/monitor/services/linode/dashboards';
  filter.configuration.placeholder = 'Select a Engine';
  filter.configuration.isMetricsFilter = false;
  filter.configuration.isMultiSelect = false;
  filter.configuration.isNonRequestFilter = false;

  return filter;
};

const getPredefinedFilter = () => {
  const filter: CloudPulseServiceTypeFilters = {} as CloudPulseServiceTypeFilters;
  filter.configuration = {} as CloudPulseServiceTypeFiltersConfiguration;
  filter.name = 'Resources';
  filter.configuration.filterKey = 'resource_id';
  filter.configuration.type = CloudPulseSelectTypes.predefined;
  filter.configuration.filterType = 'string';
  filter.configuration.placeholder = 'Select Resources';
  filter.configuration.isMetricsFilter = true;
  filter.configuration.isNonRequestFilter = false;
  return filter;
};

const getPredefinedFilterTimeDuration = () => {
  const filter: CloudPulseServiceTypeFilters = {} as CloudPulseServiceTypeFilters;
  filter.configuration = {} as CloudPulseServiceTypeFiltersConfiguration;
  filter.name = 'Time Duration';
  filter.configuration.filterKey = 'relative_time_duration';
  filter.configuration.type = CloudPulseSelectTypes.predefined;
  filter.configuration.filterType = 'string';
  filter.configuration.placeholder = 'Select Duration';
  filter.configuration.isMetricsFilter = true;
  filter.configuration.isNonRequestFilter = false;
  return filter;
};

const getPredefinedFilterRegion = () => {
  const filter: CloudPulseServiceTypeFilters = {} as CloudPulseServiceTypeFilters;
  filter.configuration = {} as CloudPulseServiceTypeFiltersConfiguration;
  filter.name = 'Region';
  filter.configuration.filterKey = 'region';
  filter.configuration.type = CloudPulseSelectTypes.predefined;
  filter.configuration.filterType = 'string';
  filter.configuration.placeholder = 'Select Region';
  filter.configuration.isMetricsFilter = true;
  filter.configuration.dependency = ['resource_id']; // this means once we select region, we pass it to resource as props and we show resources in disabled state
  filter.configuration.isNonRequestFilter = true;
  return filter;
};
