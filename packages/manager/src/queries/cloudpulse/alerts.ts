import { createAlertDefinition } from '@linode/api-v4/lib/cloudpulse';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type {
  Alert,
  AlertServiceType,
  CreateAlertDefinitionPayload,
} from '@linode/api-v4/lib/cloudpulse';
import type {
  APIError,
  Filter,
  Params,
  ResourcePage,
} from '@linode/api-v4/lib/types';
import { queryFactory } from './queries';

export const useCreateAlertDefinition = (serviceType: AlertServiceType) => {
  const queryClient = useQueryClient();
  return useMutation<Alert, APIError[], CreateAlertDefinitionPayload>({
    mutationFn: (data) => createAlertDefinition(data, serviceType),
    onSuccess() {
      queryClient.invalidateQueries(queryFactory.alerts);
    },
  });
};

export const useAlertDefinitionsQuery = (params?: Params, filter?: Filter) => {
  return useQuery<ResourcePage<Alert>, APIError[]>({
    ...queryFactory.alerts._ctx.alerts(params, filter),
  });
};

export const useAlertDefinitionQuery = (alertId: number, serviceType: string) => {
  return useQuery<Alert, APIError[]>({
    ...queryFactory.alertById(alertId, serviceType),
    enabled: alertId !== undefined,
  });
};
