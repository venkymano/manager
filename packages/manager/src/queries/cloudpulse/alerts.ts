import {
  addEntityToAlert,
  createAlertDefinition,
  deleteEntityFromAlert,
  editAlertDefinition,
} from '@linode/api-v4/lib/cloudpulse';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { queryPresets } from '../base';
import { queryFactory } from './queries';

import type {
  Alert,
  AlertServiceType,
  CreateAlertDefinitionPayload,
  EditAlertDefinitionPayload,
  EntityAlertUpdatePayload,
  NotificationChannel,
} from '@linode/api-v4/lib/cloudpulse';
import type { APIError, Filter, Params } from '@linode/api-v4/lib/types';

export const useCreateAlertDefinition = (serviceType: AlertServiceType) => {
  const queryClient = useQueryClient();
  return useMutation<Alert, APIError[], CreateAlertDefinitionPayload>({
    mutationFn: (data) => createAlertDefinition(data, serviceType),
    onSuccess() {
      queryClient.invalidateQueries(queryFactory.alerts);
    },
  });
};

export const useAllAlertDefinitionsQuery = (
  params?: Params,
  filter?: Filter,
  enabled: boolean = true
) => {
  return useQuery<Alert[], APIError[]>({
    ...queryFactory.alerts._ctx.all(params, filter),
    ...queryPresets.longLived,
    enabled,
    placeholderData: keepPreviousData,
  });
};

export const useAlertDefinitionQuery = (
  alertId: string,
  serviceType: string
) => {
  return useQuery<Alert, APIError[]>({
    ...queryFactory.alerts._ctx.alertByServiceTypeAndId(serviceType, alertId),
  });
};

export const useAlertDefinitionByServiceTypeQuery = (serviceType: string) => {
  return useQuery<Alert[], APIError[]>({
    ...queryFactory.alerts._ctx.alertsByServiceType(serviceType),
  });
};

export const useAllAlertNotificationChannelsQuery = (
  params?: Params,
  filter?: Filter
) => {
  return useQuery<NotificationChannel[], APIError[]>({
    ...queryFactory.notificationChannels._ctx.all(params, filter),
  });
};

export const useEditAlertDefinition = (
  serviceType: string,
  alertId: string
) => {
  const queryClient = useQueryClient();
  return useMutation<Alert, APIError[], EditAlertDefinitionPayload>({
    mutationFn: (data) => editAlertDefinition(data, serviceType, alertId),
    onSuccess() {
      queryClient.invalidateQueries(queryFactory.alerts);
    },
  });
};

export const useUpdateEntityToAlert = () => {
  return useMutation<{}, APIError[], EntityAlertUpdatePayload>({
    mutationFn: (payload: EntityAlertUpdatePayload) => {
      const { alertId, currentStatus, entityId, serviceType } = payload;
      return currentStatus
        ? deleteEntityFromAlert(serviceType, entityId, alertId)
        : addEntityToAlert(serviceType, entityId, {
            'alert-definition-id': alertId,
          });
    },
  });
};
