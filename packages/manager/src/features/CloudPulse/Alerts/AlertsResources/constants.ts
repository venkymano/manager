import { engineTypeMap } from '../constants';

import type { AlertInstance } from './DisplayAlertResources';

interface ColumnConfig<T> {
  accessor: (data: T) => string;
  label: string;
  sortingKey?: keyof T;
}

type ServiceColumns<T> = Record<string, ColumnConfig<T>[]>;

export const serviceColumns: ServiceColumns<AlertInstance> = {
  dbaas: [
    {
      accessor: (data) => data.label,
      label: 'Resource',
      sortingKey: 'label',
    },
    {
      accessor: (data) => data.region,
      label: 'Region',
      sortingKey: 'region',
    },
    {
      accessor: (data) =>
        engineTypeMap[data.engineType ?? ''] ?? data.engineType,
      label: 'Database Engine',
      sortingKey: 'engineType',
    },
  ],
  linode: [
    {
      accessor: (data) => data.label,
      label: 'Resource',
      sortingKey: 'label',
    },
    {
      accessor: (data) => data.region,
      label: 'Region',
      sortingKey: 'region',
    },
  ],
};
