import Factory from 'src/factories/factoryProxy';
import { pickRandom } from 'src/utilities/random';

import type { Alert } from '@linode/api-v4';

export const alertFactory = Factory.Sync.makeFactory<Alert>({
  'alert-channels': [
    {
      id: 'Test',
      label: 'Test',
      type: 'channel',
      url: 'someUrl',
    },
  ],
  created: new Date().toISOString(),
  created_by: Factory.each(() => pickRandom(['user1', 'user2', 'user3'])),
  description: 'Test Description',
  id: Factory.each(() => Math.floor(Math.random() * 1000000)),
  label: Factory.each((id) => `Alert-${id}`),
  entity_ids: Array.from({ length: 20 }, (_, i) => (i + 1).toString()),
  // resource_ids: [],
  rule_criteria: {
    rules: [
      {
        aggregation_type: 'avg',
        dimension_filters: [
          {
            dimension_label: 'Test',
            operator: 'eq',
            value: '40',
          },
        ],
        metric: 'CPU Usage',
        operator: 'gt',
        threshold: 60,
      },
      {
        aggregation_type: 'avg',
        dimension_filters: [
          {
            dimension_label: 'OperatingSystem',
            operator: 'eq',
            value: 'MacOS',
          },
          {
            dimension_label: 'OperatingSystem',
            operator: 'eq',
            value: 'Windows',
          },
          {
            dimension_label: 'Test',
            operator: 'neq',
            value: '40',
          },
          {
            dimension_label: 'OperatingSystem',
            operator: 'eq',
            value: 'MacOS',
          },
          {
            dimension_label: 'OperatingSystem',
            operator: 'eq',
            value: 'Windows',
          },
          {
            dimension_label: 'Test',
            operator: 'neq',
            value: '40',
          },
          // {
          //   dimension_label: 'OperatingSystem',
          //   operator: 'eq',
          //   value: 'MacOS',
          // },
          // {
          //   dimension_label:
          //     'OperatingSystemOperatingSystemssssssssssssssssOperatingSystemOperatingSystemssssssssssssssss',
          //   operator: 'eq',
          //   value: 'Windows',
          // },
          // {
          //   dimension_label: 'Test',
          //   operator: 'neq',
          //   value: '40',
          // },
        ],
        metric: 'CPU Usage',
        operator: 'gt',
        threshold: 50,
      },
    ],
  },
  service_type: Factory.each(() => pickRandom(['linode', 'dbaas'])),
  severity: Factory.each(() => pickRandom([0, 1, 2, 3])),
  status: Factory.each(() => pickRandom(['enabled', 'disabled'])),
  trigger_conditions: {
    evaluation_period_seconds: 600,
    polling_interval_seconds: 60,
    trigger_occurrences: 60,
  },
  type: Factory.each(() => pickRandom(['system', 'user'])),
  updated: new Date().toISOString(),
  updated_by: Factory.each(() => pickRandom(['user1', 'user2', 'user3'])),
});
