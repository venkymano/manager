import { getNotificationChannels } from '@linode/api-v4';

import { getAll } from 'src/utilities/getAll';

import type { Filter, NotificationChannel, Params } from '@linode/api-v4';

export const getAllNotificationChannels = (
  passedParams: Params = {},
  passedFilter: Filter = {}
) =>
  getAll<NotificationChannel>((params, filter) =>
    getNotificationChannels(
      { ...params, ...passedParams },
      { ...filter, ...passedFilter }
    )
  )().then((data) => data.data);
