import { databaseQueries } from 'src/queries/databases/databases';

import { CloudPulseSelectTypes } from './models';

import type { CloudPulseServiceTypeFilterMap } from './models';

const TIME_DURATION = 'Time Duration';

export const LINODE_CONFIG: Readonly<CloudPulseServiceTypeFilterMap> = {
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
        placeholder: 'Select Resources',
        priority: 2,
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
        name: TIME_DURATION,
        neededInServicePage: true,
        placeholder: 'Select Duration',
        priority: 3,
      },
      name: TIME_DURATION,
    },
    {
      configuration: {
        apiFactoryFunction: { ...databaseQueries.databases._ctx.all() },
        // apiUrl: `${API_ROOT}/databases/instances`,
        filterKey: 'clusterKey',
        filterType: 'string',
        isFilterable: true,
        isMetricsFilter: false,
        isMultiSelect: false,
        name: 'DB Cluster',
        neededInServicePage: true,
        placeholder: 'Select DB Cluster',
        priority: 3,
        type: CloudPulseSelectTypes.dynamic,
      },
      name: 'DB Cluster',
    },
    {
      configuration: {
        apiFactoryFunction: { ...databaseQueries.types },
        // apiUrl: `${API_ROOT}/databases/types`,
        filterKey: 'cluster',
        filterType: 'string',
        isFilterable: true,
        isMetricsFilter: false,
        isMultiSelect: false,
        name: 'DB Cluster types',
        neededInServicePage: true,
        placeholder: 'Select DB types',
        priority: 3,
        type: CloudPulseSelectTypes.dynamic,
      },
      name: 'DB Cluster types',
    },
  ],
  serviceType: 'linode',
};

export const DBAAS_CONFIG: Readonly<CloudPulseServiceTypeFilterMap> = {
  filters: [
    {
      configuration: {
        filterKey: 'engine',
        filterType: 'string',
        isFilterable: false, // isFilterable -- this determines whethere you need to pass it metrics api
        isMetricsFilter: false, // if it is false, it will go as a part of filter params, else global filter
        isMultiSelect: false,
        name: 'DB Engine',
        neededInServicePage: false,
        options: [
          {
            id: 'mysql',
            label: 'MySQL',
          },
          {
            id: 'postgresql',
            label: 'PostgreSQL',
          },
        ],
        placeholder: 'Select an Engine',
        priority: 2,
        type: CloudPulseSelectTypes.static,
      },
      name: 'DB Engine',
    },
    {
      configuration: {
        filterKey: 'region',
        filterType: 'string',
        isFilterable: false,
        isMetricsFilter: false,
        name: 'Region',
        neededInServicePage: false,
        priority: 1,
      },
      name: 'Region',
    },
    {
      configuration: {
        dependency: ['region', 'engine'],
        filterKey: 'resource_id',
        filterType: 'string',
        isFilterable: true,
        isMetricsFilter: true,
        isMultiSelect: true,
        name: 'Resource',
        neededInServicePage: false,
        placeholder: 'Select DB Cluster Names',
        priority: 3,
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
        name: TIME_DURATION,
        neededInServicePage: true,
        placeholder: 'Select Duration',
        priority: 4,
      },
      name: TIME_DURATION,
    },
  ],
  serviceType: 'dbaas',
};

export const FILTER_CONFIG: Readonly<
  Map<string, CloudPulseServiceTypeFilterMap>
> = new Map([
  ['dbaas', DBAAS_CONFIG],
  ['linode', LINODE_CONFIG],
]);
