import { Box, CircleProgress } from '@linode/ui';
import { Divider, Grid } from '@mui/material';
import { val } from 'factory.ts/lib/async';
import React from 'react';

import NullComponent from 'src/components/NullComponent';
import { Typography } from 'src/components/Typography';
import { useAlertNotificationChannelsQuery } from 'src/queries/cloudpulse/alerts';

import { convertStringToCamelCasesWithSpaces } from '../../Utils/utils';
import { StyledAlertsGrid } from './AlertDetail';
import { AlertDetailOverview } from './AlertDetailOverview';
import { AlertOverviewDetailRow } from './AlertDetailOverviewRow';
import { DisplayAlertChips } from './DisplayAlertChips';

import type { NotificationChannel } from '@linode/api-v4';

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

  const getLabel = (value: NotificationChannel) => {
    if (value.channel_type === 'email') {
      return {
        chips: value.content.channel_type.email_addresses,
        label: 'To',
      };
    } else if (value.channel_type === 'slack') {
      return {
        chips: [value.content.channel_type.slack_webhook_url],
        label: 'Slack Webhook URL',
      };
    } else if (value.channel_type === 'pagerduty') {
      return {
        chips: [value.content.channel_type.service_api_key],
        label: 'Service API Key',
      };
    } else {
      return {
        chips: [value.content.channel_type.webhook_url],
        label: 'Webhook URL',
      };
    }
  };

  return (
    // <Grid container display={'inline'} item xs={12}>
    <React.Fragment>
      <Typography gutterBottom marginBottom={2} variant="h2">
        Notification Channels
      </Typography>
      <Grid alignItems="center" container spacing={4}>
        {channels.map((value, idx) => (
          <React.Fragment key={idx}>
            <AlertOverviewDetailRow
              label="Type"
              value={convertStringToCamelCasesWithSpaces(value.channel_type)}
              mdLabel={2}
              mdValue={10}
            />
            <AlertOverviewDetailRow
              label="Channel"
              value={value.label}
              mdLabel={2}
              mdValue={10}
            />
            <Grid item xs={12}>
              <DisplayAlertChips
                {...getLabel(value)}
                mdLabel={2}
                mdValue={10}
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
