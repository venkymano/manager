import { Grid, Typography } from '@mui/material';
import React from 'react';

import { Box } from 'src/components/Box';

import type { Alert } from '@linode/api-v4';

interface OverviewProps {
  alert: Alert;
}
export const AlertDetailOverview = (props: OverviewProps) => {
  const { alert } = props;

  return (
    <Box
      sx={(theme) => ({
        backgroundColor:
          theme.name === 'light' ? theme.color.grey5 : theme.color.grey9,
        borderRadius: 1,
        p: 1,
      })}
      height={'500px'}
      p={3}
    >
      <Typography gutterBottom marginBottom={2} variant="h2">
        Overview
      </Typography>
      <Grid alignItems="center" container spacing={2}>
        <Grid item xs={3}>
          <Typography variant="h3">Name:</Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography variant="body2"> {alert.name}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h3">Type:</Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography variant="body2"> default</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h3">Description:</Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography variant="body2"> {alert.description}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h3">Severity:</Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography variant="body2"> {alert.severity}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h3">Created By:</Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography variant="body2"> {alert.created_by}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h3">Service:</Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography variant="body2"> {alert.service_type}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h3">Region:</Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography variant="body2"> {alert.region}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};
