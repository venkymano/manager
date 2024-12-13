import Factory from 'src/factories/factoryProxy';
import { pickRandom } from 'src/utilities/random';

import type { Alert } from '@linode/api-v4';

export const alertFactory = Factory.Sync.makeFactory<Alert>({
  channels: [],
  created: new Date().toISOString(),
  created_by: 'user1',
  description: 'Test Description',
  entity_ids: ['0', '1', '2', '3'],
  has_more_resources: true,
  id: Factory.each((i) => i),
  label: Factory.each((id) => `Alert-${id}`),
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
        value: 60,
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
        ],
        metric: 'CPU Usage',
        operator: 'gt',
        value: 50,
      },
    ],
  },
  service_type: Factory.each(() => pickRandom(['linode', 'dbaas'])),
  severity: 1,
  status: Factory.each(() => pickRandom(['enabled', 'disabled'])),
  triggerCondition: {
    evaluation_period_seconds: 20,
    polling_interval_seconds: 30,
    trigger_occurrences: 2,
  },
  type: Factory.each(() => pickRandom(['system', 'user'])),
  updated: new Date().toISOString(),
  updated_by: 'user1',
});
