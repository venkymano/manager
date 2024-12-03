import { createAlertDefinition } from '@linode/api-v4/lib/cloudpulse';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryFactory } from './queries';

import type {
  Alert,
  CreateAlertDefinitionPayload,
  NotificationChannel,
} from '@linode/api-v4/lib/cloudpulse';
import type {
  APIError,
  Filter,
  Params,
  ResourcePage,
} from '@linode/api-v4/lib/types';

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

export const useAlertDefinitionQuery = (
  alertId: number,
  serviceType: string
) => {
  return useQuery<Alert, APIError[]>({
    ...queryFactory.alerts(alertId, serviceType),
    enabled: alertId !== undefined,
  });
};

export const useAlertNotificationChannelsQuery = (
  params?: Params,
  filter?: Filter
) => {
  return useQuery<NotificationChannel[], APIError[]>({
    ...queryFactory.notificationChannels._ctx.all(params, filter),
  });
};
