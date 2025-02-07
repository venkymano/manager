import type { AlertServiceType } from '@linode/api-v4';

export interface ColumnConfig<T> {
  accessor: (data: T) => string;
  label: string;
  sortingKey?: keyof T;
}

export interface EngineType {
  id: string;
  label: string;
}

export type ServiceColumns<T> = Record<
  '' | AlertServiceType,
  ColumnConfig<T>[]
>;

export type AlertFilterKey = 'engineType'; // will be extended to have tags, plan etc.,

export type AlertFilterType = boolean | number | string | undefined;
