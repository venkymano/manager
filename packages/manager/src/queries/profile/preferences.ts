import { updateUserPreferences } from '@linode/api-v4';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryPresets } from '../base';
import { profileQueries } from './profile';

import type { APIError } from '@linode/api-v4';
import type { QueryClient } from '@tanstack/react-query';
import type { ManagerPreferences } from 'src/types/ManagerPreferences';

export const usePreferences = (enabled = true) =>
  useQuery<ManagerPreferences, APIError[]>({
    ...profileQueries.preferences,
    ...queryPresets.oneTimeFetch,
    enabled,
  });

export const useMutatePreferences = (replace = false, _isAclp = false) => {
  const { data: preferences } = usePreferences(!replace);
  const queryClient = useQueryClient();

  return useMutation<
    ManagerPreferences,
    APIError[],
    Partial<ManagerPreferences>
  >({
    mutationFn: (data) =>
      updateUserPreferences({
        ...(!replace && preferences !== undefined ? preferences : {}),
        ...data,
      }),
    onMutate: (data) =>
      updatePreferenceData(data, replace, _isAclp, queryClient),
  });
};

export const updatePreferenceData = (
  newData: Partial<ManagerPreferences>,
  replace: boolean,
  isAclp: boolean,
  queryClient: QueryClient
): void => {
  queryClient.setQueryData<ManagerPreferences>(
    profileQueries.preferences.queryKey,
    (oldData) => {
      if (isAclp && oldData) {
        newData.aclpPreference = {
          ...oldData.aclpPreference,
          ...newData.aclpPreference,
        };
      }
      return {
        ...(!replace ? oldData : {}),
        ...newData,
      };
    }
  );
};
