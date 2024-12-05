import { CircleProgress } from '@linode/ui';
import { Divider, Grid } from '@mui/material';
import React from 'react';

import { ErrorState } from 'src/components/ErrorState/ErrorState';
import NullComponent from 'src/components/NullComponent';
import { Typography } from 'src/components/Typography';
import { useAlertNotificationChannelsQuery } from 'src/queries/cloudpulse/alerts';

import { convertStringToCamelCasesWithSpaces } from '../../Utils/utils';
import { getChipLabels } from '../Utils/utils';
import { DisplayAlertChips } from './AlertDetailChips';
import { AlertDetailRow } from './AlertDetailRow';

interface NotificationProps {
  /*
   * The list of channel ids associated with the alert for which we need to display the notification channels
   */
  channelIds: number[];
}
export const AlertDetailNotification = (props: NotificationProps) => {
  const { channelIds } = props;

  const {
    data: channels,
    isError,
    isFetching,
  } = useAlertNotificationChannelsQuery({}, { id: channelIds.join(',') });

  if (isFetching) {
    return <CircleProgress />;
  }

  if (!channels?.length) {
    return <NullComponent />;
  }

  return (
    <React.Fragment>
      <Typography gutterBottom marginBottom={2} variant="h2">
        Notification Channels
      </Typography>
      {isError && (
        <ErrorState errorText="Failed to load notification channels" />
      )}
      {!isError && (
        <Grid alignItems="center" container spacing={2}>
          {channels.map((value, index) => (
            <Grid container item key={value.id} spacing={2}>
              <AlertDetailRow
                label="Type"
                mdLabel={2}
                mdValue={10}
                value={convertStringToCamelCasesWithSpaces(value.channel_type)}
              />
              <AlertDetailRow
                label="Channel"
                mdLabel={2}
                mdValue={10}
                value={value.label}
              />
              <Grid item xs={12}>
                <DisplayAlertChips
                  {...getChipLabels(value)}
                  mdLabel={2}
                  mdValue={10}
                />
              </Grid>
              {channels.length > 1 && index !== channels.length - 1 && (
                <Grid item xs={12}>
                  <Divider />
                </Grid>
              )}
            </Grid>
          ))}
        </Grid>
      )}
    </React.Fragment>
  );
};
