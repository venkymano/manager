import { getDatabases, getLinodes, getLoadbalancers } from '@linode/api-v4';
import { useQuery } from '@tanstack/react-query';

import { queryPresets } from '../base';

import { Engine } from '@linode/api-v4';

import type {
  APIError,
  Database,
  DatabaseInstance,
  Filter,
  Linode,
  Loadbalancer,
  Params,
  ResourcePage,
} from '@linode/api-v4';

export const QUERY_KEY = 'cloudview-resources';

export const useLoadBalancerResourcesQuery = (
  runQuery: boolean,
  params?: Params,
  filter?: Filter
) => {
  return useQuery<ResourcePage<Loadbalancer>, APIError[]>(
    [QUERY_KEY, 'paginated', params, filter],
    () => getLoadbalancers(params, filter),
    { enabled: runQuery, keepPreviousData: true }
  );
};

export const useLinodeResourcesQuery = (
  runQuery: boolean,
  params: Params = {},
  filter: Filter = {}
) => {
  return useQuery<ResourcePage<Linode>, APIError[]>(
    [QUERY_KEY, 'paginated', params, filter],
    () => getLinodes(params, filter),
    { ...queryPresets.longLived, enabled: runQuery, keepPreviousData: true }
  );
};

export const useDBEngineResourcesQuery = (
  runQuery: boolean,
  filter: Filter = {},
  params: Params = {}
) => {
  return useQuery<ResourcePage<DatabaseInstance>, APIError[]>(
    [QUERY_KEY, 'paginated', params, filter],
    () => getDatabases(params, filter),
    { ...queryPresets.longLived, enabled: runQuery, keepPreviousData: true }
  );
}

export const useResourcesQuery = (
  enabled: boolean,
  params: Params = {},
  filter: Filter = {},
  serviceType: string
) => {
  return useQuery<ResourcePage<any>, APIError[]>(
    [QUERY_KEY, 'paginated', params, filter],
    callAppropriateServicesForResources(serviceType, params, filter),
    { ...queryPresets.longLived, enabled, keepPreviousData: true }
  );
};

const callAppropriateServicesForResources = (
  serviceType: string,
  params: Params = {},
  filter: Filter = {}
) => {
  switch (serviceType) {
    case 'linode':
      return () => getLinodes(params, filter);
    case 'aclb':
      return () => getLoadbalancers(params, filter);
    case 'dbass':
      return () => getDatabases(params, filter);
    default:
      return () => getLinodes(params, filter);
  }
};
