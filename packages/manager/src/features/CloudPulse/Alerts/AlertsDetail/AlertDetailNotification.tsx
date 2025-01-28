import { CircleProgress, Stack, Typography } from '@linode/ui';
import { Divider, Grid } from '@mui/material';
import React from 'react';

import EntityIcon from 'src/assets/icons/entityIcons/alerts.svg';
import { ErrorState } from 'src/components/ErrorState/ErrorState';
import { useAllAlertNotificationChannelsQuery } from 'src/queries/cloudpulse/alerts';

import { convertStringToCamelCasesWithSpaces } from '../../Utils/utils';
import { getChipLabels } from '../Utils/utils';
import { StyledPlaceholder } from './AlertDetail';
import { AlertDetailRow } from './AlertDetailRow';
import { DisplayAlertDetailChips } from './DisplayAlertDetailChips';

import type { Filter } from '@linode/api-v4';

interface NotificationChannelProps {
  /*
   * The list of channel ids associated with the alert for which we need to display the notification channels
   */
  channelIds: string[];
}
export const AlertDetailNotification = React.memo(
  (props: NotificationChannelProps) => {
    const { channelIds } = props;

    const channelIdOrFilter: Filter = {
      '+or': channelIds.map((id) => ({ id })),
    };

    const {
      data: channels,
      isError,
      isFetching,
    } = useAllAlertNotificationChannelsQuery({}, channelIdOrFilter);

    // early returns for fetching, error and no data case
    if (isFetching) {
      return getAlertNotificationMessage(<CircleProgress />);
    }
    if (isError) {
      return getAlertNotificationMessage(
        <ErrorState errorText="Failed to load notification channels." />
      );
    }
    if (!channels?.length) {
      return getAlertNotificationMessage(
        <StyledPlaceholder
          icon={EntityIcon}
          title="No notification channels to display."
        />
      );
    }

    return (
      <Stack gap={2}>
        <Typography marginBottom={2} variant="h2">
          Notification Channels
        </Typography>
        <Grid alignItems="center" container spacing={2}>
          {channels.map((notificationChannel, index) => {
            const { channel_type, id, label } = notificationChannel;
            return (
              <Grid container item key={id} spacing={2}>
                <AlertDetailRow
                  label="Type"
                  labelGridColumns={2}
                  value={convertStringToCamelCasesWithSpaces(channel_type)}
                  valueGridColumns={10}
                />
                <AlertDetailRow
                  label="Channel"
                  labelGridColumns={2}
                  value={label}
                  valueGridColumns={10}
                />
                <Grid item xs={12}>
                  <DisplayAlertDetailChips
                    {...getChipLabels(notificationChannel)}
                    labelGridColumns={2}
                    valueGridColumns={10}
                  />
                </Grid>
                {channels.length > 1 && index !== channels.length - 1 && (
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                )}
              </Grid>
            );
          })}
        </Grid>
      </Stack>
    );
  }
);

/**
 * @param messageComponent Components like CircleProgess, ErrorState, Placeholder that needs to be displayed
 * @returns JSX element with title
 */
const getAlertNotificationMessage = (messageComponent: React.ReactNode) => {
  return (
    <Stack gap={2}>
      <Typography variant="h2">Notification Channels</Typography>
      {messageComponent}
    </Stack>
  );
};
