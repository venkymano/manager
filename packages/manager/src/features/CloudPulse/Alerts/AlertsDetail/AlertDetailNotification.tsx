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

  const { data, isError, isFetching } = useAlertNotificationChannelsQuery(
    {},
    { id: channelIds.join(',') }
  );

  if (isFetching) {
    return <CircleProgress />;
  }

  if (!data?.data?.length) {
    return <NullComponent />;
  }

  const channels = data.data;

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
          {channels.map((value) => (
            <Grid container item key={value.id} spacing={2}>
              <AlertDetailRow
                label="Type"
                mdLabel={1}
                mdValue={11}
                value={convertStringToCamelCasesWithSpaces(value.channel_type)}
              />
              <AlertDetailRow
                label="Channel"
                mdLabel={1}
                mdValue={11}
                value={value.label}
              />
              <Grid item xs={12}>
                <DisplayAlertChips
                  {...getChipLabels(value)}
                  mdLabel={1}
                  mdValue={11}
                />
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
            </Grid>
          ))}
        </Grid>
      )}
    </React.Fragment>
  );
};
