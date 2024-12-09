import Factory from 'src/factories/factoryProxy';
import { pickRandom } from 'src/utilities/random';

import type { Alert } from '@linode/api-v4';

export const alertFactory = Factory.Sync.makeFactory<Alert>({
  channels: [],
  created: new Date().toISOString(),
  created_by: 'user1',
  description: 'Test Description',
  id: Factory.each((i) => i),
  label: Factory.each((id) => `Alert-${id}`),
  resource_ids: ['0', '1', '2', '3'],
  rule_criteria: {
    rules: [],
  },
  service_type: Factory.each((i) => pickRandom(['linode', 'dbaas'])),
  severity: 1,
  status: 'enabled',
  triggerCondition: {
    evaluation_period_seconds: 0,
    polling_interval_seconds: 0,
    trigger_occurrences: 0,
  },
  type: Factory.each((i) => pickRandom(['system', 'user'])),
  updated: new Date().toISOString(),
  updated_by: 'user1',
});
