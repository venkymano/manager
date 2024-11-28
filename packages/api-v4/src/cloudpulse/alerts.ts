import { createAlertDefinitionSchema } from '@linode/validation';
import Request, {
  setURL,
  setMethod,
  setData,
  setParams,
  setXFilter,
} from '../request';
import {
  Alert,
  CreateAlertDefinitionPayload,
  NotificationChannel,
} from './types';
import { BETA_API_ROOT as API_ROOT } from 'src/constants';
import { Params, Filter, ResourcePage } from 'src/types';

export const createAlertDefinition = (data: CreateAlertDefinitionPayload) =>
  Request<Alert>(
    setURL(`${API_ROOT}/monitor/alert-definitions`),
    setMethod('POST'),
    setData(data, createAlertDefinitionSchema)
  );

export const getAlertDefinitions = (params?: Params, filters?: Filter) =>
  Request<ResourcePage<Alert>>(
    setURL(`${API_ROOT}/monitor/alert-definitions`),
    setMethod('GET'),
    setParams(params),
    setXFilter(filters)
  );

export const getAlertDefinitionById = (alertId: number, serviceType: string) =>
  Request<Alert>(
    setURL(
      `${API_ROOT}/monitor/services/${encodeURIComponent(
        serviceType
      )}/alert-definitions/${encodeURIComponent(alertId)}`
    ),
    setMethod('GET')
  );

export const getNotificationChannels = (params?: Params, filters?: Filter) =>
  Request<ResourcePage<NotificationChannel>>(
    setURL(`${API_ROOT}/monitor/alert-channels`),
    setMethod('GET'),
    setParams(params),
    setXFilter(filters)
  );
