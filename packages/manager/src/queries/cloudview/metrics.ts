import {
  APIError,
  CloudViewMetricsRequest,
  CloudViewMetricsResponse,
  getCloudViewMetricsAPI,
} from '@linode/api-v4';
import { useIsFetching, useQuery, useQueryClient } from '@tanstack/react-query';

export const useCloudViewMetricsQuery = (
  serviceType: string,
  request: CloudViewMetricsRequest,
  props: any,
  widgetProps: any,
  enabled: boolean | undefined
) => {
  const queryClient = useQueryClient();
  return useQuery<CloudViewMetricsResponse, APIError[]>(
    [request, widgetProps, serviceType], // querykey and dashboardId makes this uniquely identifiable
    () => getCloudViewMetricsAPI(props.authToken, serviceType, request),
    {
      enabled: !!enabled,
      onError(err: APIError[]) {
        if (err && err.length > 0 && err[0].reason == 'JWE Decrypt: expired') {
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
      refetchInterval: 60000,
      refetchOnWindowFocus: false,
      retry: 0,
    }
  );
};
