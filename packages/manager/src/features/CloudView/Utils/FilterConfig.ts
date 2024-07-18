import { CloudPulseServiceTypeFilterMap } from 'src/featureFlags';

import { CloudPulseSelectTypes } from '../shared/CloudPulseCustomSelect';

export const LINODE_CONFIG: CloudPulseServiceTypeFilterMap = {
  filters: [
    {
      configuration: {
        filterKey: 'region',
        filterType: 'string',
        isFilterable: false,
        isMetricsFilter: false,
        name: 'Region',
        neededInServicePage: false,
        priority: 1,
        type: CloudPulseSelectTypes.predefined,
      },
      name: 'Region',
    },
    {
      configuration: {
        dependency: ['region'],
        filterKey: 'resource_id',
        filterType: 'string',
        isFilterable: true,
        isMetricsFilter: true,
        isMultiSelect: true,
        name: 'Resource',
        neededInServicePage: false,
        placeholder: 'Select a Resource',
        priority: 2,
        type: CloudPulseSelectTypes.predefined,
      },
      name: 'Resources',
    },
    {
      configuration: {
        filterKey: 'relative_time_duration',
        filterType: 'string',
        isFilterable: true,
        isMetricsFilter: true,
        isMultiSelect: false,
        name: 'Time Duration',
        neededInServicePage: true,
        placeholder: 'Select Duration',
        priority: 3,
        type: CloudPulseSelectTypes.predefined,
      },
      name: 'Time Duration',
    },
    {
      configuration: {
        filterKey: 'test_filter',
        filterType: 'string',
        isFilterable: true,
        isMetricsFilter: false,
        isMultiSelect: true,
        name: 'Test Filter',
        neededInServicePage: true,
        options: [
          { id: '1', label: 'Test 1' },
          { id: '2', label: 'Test 2' },
          { id: '3', label: 'Test 3' },
        ],
        placeholder: 'Select Test Filter',
        priority: 3,
        type: CloudPulseSelectTypes.static,
      },
      name: 'Time Duration',
    },
  ],
  serviceType: 'linode',
};

export const DBASS_CONFIG: CloudPulseServiceTypeFilterMap = {
  filters: [
    {
      configuration: {
        filterKey: 'region',
        filterType: 'string',
        isFilterable: true,
        isMetricsFilter: false,
        name: 'Region',
        neededInServicePage: false,
        priority: 1,
        type: CloudPulseSelectTypes.predefined,
      },
      name: 'Region',
    },
    {
      configuration: {
        apiIdField: 'id',
        apiLabelField: ['engine', 'version'],
        apiUrl: 'https://api.linode.com/v4beta/databases/engines',
        filterKey: 'dbEngine',
        filterType: 'string',
        isFilterable: true, // isFilterable
        isMetricsFilter: false,
        name: 'DB Engine',
        neededInServicePage: false,
        placeholder: 'Select an Engine',
        priority: 2,
        type: CloudPulseSelectTypes.dynamic,
      },
      name: 'DB Engine',
    },
    {
      configuration: {
        dependency: ['region', 'dbEngine'],
        filterKey: 'resource_id',
        filterType: 'string',
        isFilterable: false,
        isMetricsFilter: true,
        isMultiSelect: true,
        name: 'Resource',
        neededInServicePage: false,
        placeholder: 'Select a Resource',
        priority: 3,
        type: CloudPulseSelectTypes.predefined,
      },
      name: 'Resources',
    },
    {
      configuration: {
        filterKey: 'relative_time_duration',
        filterType: 'string',
        isFilterable: false,
        isMetricsFilter: true,
        isMultiSelect: false,
        name: 'Time Duration',
        neededInServicePage: true,
        placeholder: 'Select Duration',
        priority: 4,
        type: CloudPulseSelectTypes.predefined,
      },
      name: 'Time Duration',
    },
  ],
  serviceType: 'dbass',
};

export const FILTER_CONFIG: Map<
  string,
  CloudPulseServiceTypeFilterMap
> = new Map([
  ['dbass', DBASS_CONFIG],
  ['linode', LINODE_CONFIG],
]);
