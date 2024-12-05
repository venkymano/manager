import type { AlertSeverityType } from '@linode/api-v4';

export interface Item<T = number | string, L = string> {
  data?: any;
  label: L;
  value: T;
}
export const alertSeverityOptions: Item<AlertSeverityType>[] = [
  { label: 'Info', value: 3 },
  { label: 'Low', value: 2 },
  { label: 'Medium', value: 1 },
  { label: 'Severe', value: 0 },
];

export const aggregationTypes = {
  avg: 'Average',
  count: 'Count',
  max: 'Maximum',
  min: 'Minimum',
  sum: 'Sum',
};
export const operators = {
  eq: '=',
  gt: '>',
  gte: '>=',
  lt: '<',
  lte: '<=',
};

export const operatorLabel = {
  endswith: 'ends with',
  eq: 'equals',
  neq: 'not equals',
  startswith: 'starts with',
};

export const severityMap = {
  0: 'Critical',
  1: 'Medium',
  2: 'Low',
  3: 'Info',
};
