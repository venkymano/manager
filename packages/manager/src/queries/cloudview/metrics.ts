import {
  APIError,
  CloudViewMetricsRequest,
  CloudViewMetricsResponse,
  getCloudViewMetricsAPI,
} from '@linode/api-v4';
import { useQuery } from '@tanstack/react-query';


export const useCloudViewMetricsQuery = (
  serviceType: string,
  request: CloudViewMetricsRequest,
  props: any,
  widgetProps: any,
  enabled: boolean | undefined,
  readApiEndpoint: string
) => {
  return useQuery<CloudViewMetricsResponse, APIError[]>(
    [request, widgetProps, serviceType], // querykey and dashboardId makes this uniquely identifiable
    () => getCloudViewMetricsAPI(props.authToken,readApiEndpoint, serviceType, request),
    {
      enabled: !!enabled,
      refetchInterval: 6000000,
      retry: 0,
      refetchOnWindowFocus: false
    }
  );
};
