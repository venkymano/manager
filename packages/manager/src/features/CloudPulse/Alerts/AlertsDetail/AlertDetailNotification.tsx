import { Grid } from '@mui/material';
import React from 'react';

import { Box } from '@linode/ui';
import { Chip } from 'src/components/Chip';
import { Divider } from '@linode/ui';
import { Typography } from 'src/components/Typography';

import type { Alert } from '@linode/api-v4';

interface NotificationProps {
  alert: Alert;
}
export const AlertDetailNotification = (props: NotificationProps) => {
  const { alert } = props;
  const notifications = alert.channels;
  return (
    <Box
      sx={(theme) => ({
        backgroundColor:
          theme.name === 'light' ? theme.color.grey5 : theme.color.grey9,
        borderRadius: 1,
        p: 1,
      })}
      p={3}
    >
      <Typography gutterBottom marginBottom={2} variant="h2">
        Notification
      </Typography>
      {notifications.length > 0 &&
        notifications.map((notification, idx) => (
          <>
            <Grid container spacing={1}>
              <Grid item sm={2} xs={3}>
                <Typography variant="h3">Type:</Typography>
              </Grid>
              <Grid item sm={10} xs={9}>
                <Typography variant="subtitle2">{notification.type}</Typography>
              </Grid>
              <Grid item sm={2} xs={3}>
                <Typography variant="h3">Template Name:</Typography>
              </Grid>
              <Grid item sm={10} xs={9}>
                <Typography variant="subtitle2">
                  {notification.label}
                </Typography>
              </Grid>
              <Grid alignContent={'center'} item sm={2} xs={12}>
                <Typography variant="h3">To:</Typography>
              </Grid>
              {/* <Grid item sm={10} xs={12}>
                {notification.values &&
                  notification.values.to.length > 0 &&
                  notification.values.to.map((email: string, id: number) => (
                    <Chip key={id} label={email} variant="outlined" />
                  ))}
              </Grid> */}
            </Grid>
            {idx + 1 !== notifications.length && <Divider />}
          </>
        ))}
      <Grid container paddingLeft={2}>
        {/* <Grid alignContent={'center'} item md={1}>
          <Typography variant="h3">To:</Typography>
        </Grid>
        <Grid item md={11}>
          {alert.notification.values &&
            alert.notification.values.to.length > 0 &&
            alert.notification.values.to.map(
              (email: string, id: number) => (
                <Chip key={id} label={email} />
              )
            )}
        </Grid> */}
      </Grid>
    </Box>
  );
};
