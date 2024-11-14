import { createAlertDefinition } from '@linode/api-v4/lib/cloudpulse';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type {
  Alert,
  CreateAlertDefinitionPayload,
} from '@linode/api-v4/lib/cloudpulse';
import type {
  APIError,
  Filter,
  Params,
  ResourcePage,
} from '@linode/api-v4/lib/types';
import { queryFactory } from './queries';

export const aclpQueryKey = 'aclp-alerts';

export const useCreateAlertDefinition = () => {
  const queryClient = useQueryClient();
  return useMutation<Alert, APIError[], CreateAlertDefinitionPayload>({
    mutationFn: (data) => createAlertDefinition(data),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: [aclpQueryKey] });
    },
  });
};

export const useAlertDefinitionsQuery = (params?: Params, filter?: Filter) => {
  return useQuery<ResourcePage<Alert>, APIError[]>({
    ...queryFactory.lists._ctx.alerts(params, filter),
  });
};

export const useAlertDefinitionQuery = (alertId: number) => {
  return useQuery<Alert, APIError[]>({
    ...queryFactory.alerts(alertId),
    enabled: alertId !== undefined,
  });
};
