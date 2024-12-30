import { createAlertDefinitionSchema } from '@linode/validation';
import Request, {
  setURL,
  setMethod,
  setData,
  setParams,
  setXFilter,
  // setHeaders,
} from '../request';
import {
  Alert,
  CreateAlertDefinitionPayload,
  EditAlertResourcesPayload,
  NotificationChannel,
} from './types';
import { BETA_API_ROOT as API_ROOT } from 'src/constants';
import { Params, Filter, ResourcePage } from 'src/types';

// const API_ROOT = 'http://blr-lhvk5r.bangalore.corp.akamai.com:9001/v4beta';

export const createAlertDefinition = (data: CreateAlertDefinitionPayload) =>
  Request<Alert>(
    setURL(`${API_ROOT}/monitor/alert-definitions`),
    setMethod('POST'),
    setData(data, createAlertDefinitionSchema)
  );

export const editAlertDefinition = (
  data: EditAlertResourcesPayload,
  serviceType: string,
  alertId: number
) =>
  Request<Alert>(
    setURL(
      `${API_ROOT}/monitor/services/${encodeURIComponent(
        serviceType
      )}/alert-definitions/${encodeURIComponent(alertId)}`
    ),
    setMethod('PUT'),
    setData(data)
  );

export const getAlertDefinitions = (params?: Params, filters?: Filter) =>
  Request<ResourcePage<Alert>>(
    setURL(`${API_ROOT}/monitor/alert-definitions`),
    setMethod('GET'),
    setParams(params),
    setXFilter(filters),
    // setHeaders({
    //   Authorization: 'Bearer vagrant',
    // })
  );

export const getAlertDefinitionById = (alertId: number, serviceType: string) =>
  Request<Alert>(
    setURL(
      `${API_ROOT}/monitor/services/${encodeURIComponent(
        serviceType
      )}/alert-definitions/${encodeURIComponent(alertId)}`
    ),
    setMethod('GET'),
    // setHeaders({
    //   Authorization: 'Bearer vagrant',
    // })
  );

export const getNotificationChannels = (params?: Params, filters?: Filter) =>
  Request<ResourcePage<NotificationChannel>>(
    setURL(`${API_ROOT}/monitor/alert-channels`),
    setMethod('GET'),
    setParams(params),
    setXFilter(filters)
  );
