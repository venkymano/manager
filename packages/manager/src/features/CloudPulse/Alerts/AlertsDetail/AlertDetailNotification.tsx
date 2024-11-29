import { CircleProgress } from '@linode/ui';
import { Divider, Grid } from '@mui/material';
import React from 'react';

import NullComponent from 'src/components/NullComponent';
import { Typography } from 'src/components/Typography';
import { useAlertNotificationChannelsQuery } from 'src/queries/cloudpulse/alerts';

import { convertStringToCamelCasesWithSpaces } from '../../Utils/utils';
import { getChipLabels } from '../Utils/utils';
import { DisplayAlertChips } from './AlertDetailChips';
import { AlertDetailRow } from './AlertDetailRow';

interface NotificationProps {
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

  if (isError || !data) {
    return <NullComponent />;
  }

  if (!data || data.data.length === 0) {
    return <NullComponent />;
  }

  const channels = data.data;

  return (
    // <Grid container display={'inline'} item xs={12}>
    <React.Fragment>
      <Typography gutterBottom marginBottom={2} variant="h2">
        Notification Channels
      </Typography>
      <Grid alignItems="center" container spacing={2}>
        {channels.map((value, idx) => (
          <React.Fragment key={idx}>
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
          </React.Fragment>
        ))}
      </Grid>
    </React.Fragment>
  );
};
