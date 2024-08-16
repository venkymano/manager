import { getFilters } from '@linode/api-v4';
import { useQuery } from '@tanstack/react-query';

import { getAll } from 'src/utilities/getAll';

import type { Filter, Params } from '@linode/api-v4';
import type { QueryFunction, QueryKey } from '@tanstack/react-query';
import type {
  CloudPulseServiceTypeFiltersOptions,
  QueryFunctionSingleType,
  QueryFunctionType,
} from 'src/features/CloudPulse/Utils/models';

export interface CustomFilterQueryProps {
  apiFactoryFunction?: {
    queryFn: QueryFunction<Awaited<QueryFunctionType>>;
    queryKey: QueryKey;
  };
  enabled: boolean;
  filter?: Filter;
  filterKey?: string;
  idField: string;
  labelField: string;
  params?: Params;
  url: string;
}

export const useGetCustomFiltersQuery = (
  queryProps: CustomFilterQueryProps
) => {
  const { apiFactoryFunction, enabled, idField, labelField } = queryProps;

  return useQuery<
    QueryFunctionType,
    unknown,
    CloudPulseServiceTypeFiltersOptions[]
  >({
    // receive filters and  return only id and label
    enabled,
    ...apiFactoryFunction,
    select: (filters: QueryFunctionType) => {
      // whatever field we receive, just return id and label
      return filters
        .filter(
          (filter) =>
            filter !== undefined &&
            getStringValue(filter, idField) &&
            getStringValue(filter, labelField)
        )
        .map(
          (filter): CloudPulseServiceTypeFiltersOptions => {
            return {
              id: getStringValue(filter, idField) ?? '',
              label: getStringValue(filter, labelField) ?? '',
            };
          }
        );
    },
  });
};

const getStringValue = (
  filter: QueryFunctionSingleType,
  fieldKey: string
): string | undefined => {
  if (fieldKey in filter) {
    const value = filter[fieldKey as keyof typeof filter];
    if (value) {
      return String(value);
    }
  }
  return undefined;
};

export const getAllFilters = (
  passedParams: Params = {},
  passedFilter: Filter = {},
  url: string
) =>
  getAll<{ [key: string]: unknown }>((params, filter) =>
    getFilters(
      { ...params, ...passedParams },
      { ...filter, ...passedFilter },
      url
    )
  )().then((data) => data.data);
