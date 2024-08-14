import { useQuery } from '@tanstack/react-query';

import { databaseQueries } from '../databases/databases';
import { volumeQueries } from '../volumes/volumes';
import { queryFactory } from './queries';

import type { CustomFilterQueryProps } from './customfilters';
import type {
  DatabaseEngine,
  DatabaseInstance,
  DatabaseType,
  Filter,
  Params,
  Volume,
} from '@linode/api-v4';
import type { CloudPulseResources } from 'src/features/CloudPulse/shared/CloudPulseResourcesSelect';
import type { CloudPulseServiceTypeFiltersOptions } from 'src/features/CloudPulse/Utils/models';

const getPredefinedQueriesFromFactory = (filterKey?: string) => {
  switch (filterKey) {
    case 'engine':
      return databaseQueries.engines;
    case 'instances':
      return databaseQueries.databases._ctx.all();
    case 'types':
      return volumeQueries.lists._ctx.all();
    default:
      throw new Error("Can't fetch filters from API");
  }
};

export const useGetCustomFiltersQuery = (
  queryProps: CustomFilterQueryProps
) => {
  const {
    apiFactoryFunction,
    enabled,
    filter,
    filterKey,
    idField,
    labelField,
    params,
    url,
  } = queryProps;

  useQuery<
    DatabaseEngine[] | DatabaseInstance[] | DatabaseType[] | Volume[],
    unknown,
    CloudPulseServiceTypeFiltersOptions[]
  >({
    ...getPredefinedQueriesFromFactory(filterKey),
    enabled: enabled && filterKey !== undefined,
    select: (data) => {
      return data.map((filterObj) => {
        return {
          id: getStringValue(filterObj, idField),
          label: getStringValue(filterObj, labelField),
        };
      });
    },
  });
};

const getStringValue = (
  filter: DatabaseEngine | DatabaseInstance | DatabaseType | Volume,
  fieldKey: string
): string => {
  if (fieldKey in filter) {
    const value = filter[fieldKey as keyof typeof filter];
    if (typeof value === 'string') {
      return value;
    }
  }
  throw new Error('Unable to fetch proper field values from API');
};
