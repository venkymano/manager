import type {
  AlertSeverityType,
  AlertStatusType,
  DimensionFilterOperatorType,
  MetricAggregationType,
  MetricOperatorType,
} from '@linode/api-v4';
import type { Status } from 'src/components/StatusIcon/StatusIcon';

export interface Item<L extends string, T> {
  label: L;
  value: T;
}
export const alertSeverityOptions: Item<string, AlertSeverityType>[] = [
  { label: 'Info', value: 3 },
  { label: 'Low', value: 2 },
  { label: 'Medium', value: 1 },
  { label: 'Severe', value: 0 },
];

export const engineTypeOptions: Item<string, string>[] = [
  {
    label: 'MySQL',
    value: 'mysql',
  },
  {
    label: 'PostgreSQL',
    value: 'postgresql',
  },
];

export const MetricOperatorOptions: Item<string, MetricOperatorType>[] = [
  {
    label: '>',
    value: 'gt',
  },
  {
    label: '<',
    value: 'lt',
  },
  {
    label: '>=',
    value: 'gte',
  },
  {
    label: '<=',
    value: 'lte',
  },
  {
    label: '==',
    value: 'eq',
  },
];

export const MetricAggregationOptions: Item<string, MetricAggregationType>[] = [
  {
    label: 'Average',
    value: 'avg',
  },
  {
    label: 'Minimum',
    value: 'min',
  },
  {
    label: 'Maximum',
    value: 'max',
  },
  {
    label: 'Count',
    value: 'count',
  },
  {
    label: 'Sum',
    value: 'sum',
  },
];

export const severityMap: Record<AlertSeverityType, string> = {
  0: 'Severe',
  1: 'Medium',
  2: 'Low',
  3: 'Info',
};

export const alertStatusToIconStatusMap: Record<AlertStatusType, Status> = {
  disabled: 'inactive',
  enabled: 'active',
};

export const metricOperatorTypeMap: Record<MetricOperatorType, string> = {
  eq: '=',
  gt: '>',
  gte: '>=',
  lt: '<',
  lte: '<=',
};

export const aggregationTypeMap: Record<MetricAggregationType, string> = {
  avg: 'Average',
  count: 'Count',
  max: 'Maximum',
  min: 'Minimum',
  sum: 'Sum',
};

export const dimensionOperatorTypeMap: Record<
  DimensionFilterOperatorType,
  string
> = {
  endswith: 'ends with',
  eq: 'equals',
  neq: 'not equals',
  startswith: 'starts with',
};
