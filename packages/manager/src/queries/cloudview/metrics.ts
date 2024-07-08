import {
  APIError,
  CloudViewMetricsRequest,
  CloudViewMetricsResponse,
  getCloudViewMetricsAPI,
} from '@linode/api-v4';
import { useIsFetching, useQuery, useQueryClient } from '@tanstack/react-query';

export const useCloudViewMetricsQuery = (
  serviceType: string,
  request: any,
  props: any,
  widgetProps: any,
  enabled: boolean | undefined,
  readApiEndpoint: string
) => {
  const queryClient = useQueryClient();
  return useQuery<CloudViewMetricsResponse, APIError[]>(
    [request, widgetProps, serviceType, props.authToken], // querykey and dashboardId makes this uniquely identifiable
    () => getCloudViewMetricsAPI(props.authToken,readApiEndpoint, serviceType, request),
    {
      enabled: !!enabled,
      onError(err: APIError[]) {
        if (err && err.length > 0 && err[0].reason == 'Token expired') {
          const currentJWEtokenCache: any = queryClient.getQueryData([
            'jwe-token',
            serviceType,
          ]);
          if (
            currentJWEtokenCache.token == props.authToken &&
            !queryClient.isFetching(['jwe-token', serviceType])
          ) {
            queryClient.invalidateQueries(['jwe-token', serviceType]);
          }
        }
      },
      refetchInterval: 6000000,
      retry: 0,
      refetchOnWindowFocus: false
    }
  );
};
