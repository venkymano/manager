import { Card, Grid, Typography } from '@mui/material';
import React from 'react';

import { Box } from 'src/components/Box';
import { Chip } from 'src/components/Chip';
import { Divider } from 'src/components/Divider';

import type { Alert } from '@linode/api-v4';

interface CriteriaProps {
  alert: Alert;
}

export const AlertDetailCriteria = (props: CriteriaProps) => {
  const { alert } = props;
  console.log(alert);
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
        Criteria
      </Typography>
      <Grid alignItems="center" container spacing={2}>
        <Grid item sm={3}>
          <Typography variant="h3">Polling interval: </Typography>
        </Grid>
        <Grid item sm={9}>
          <Typography variant="body2">
            {alert.triggerCondition.polling_interval_seconds}
          </Typography>
        </Grid>
        <Grid item sm={3}>
          <Typography variant="h3">Evaluation period: </Typography>
        </Grid>
        <Grid item sm={9}>
          <Typography variant="body2">
            {alert.triggerCondition.evaluation_period_seconds}
          </Typography>
        </Grid>
        <Grid item sm={3}>
          <Typography variant="h3">Trigger alert when: </Typography>
        </Grid>
        <Grid item sm={9}>
          <Typography variant="body2">
            {`All Criteria are met for 2 consecutive occurance`}
          </Typography>
        </Grid>
        <Grid item sm={12}>
          <Divider />
        </Grid>
        <Grid item sm={3}>
          <Typography variant="h3">Threshold: </Typography>
        </Grid>
        <Grid item sm={9}>
          <Typography variant="body2">
            {`${alert.criteria[0].metric} ${alert.criteria[0].aggregation_type} ${alert.criteria[0].operator} ${alert.criteria[0].value}`}
          </Typography>
        </Grid>
        <Grid item sm={3}>
          <Typography variant="h3">Dimension filter: </Typography>
        </Grid>
        <Grid item sm={9}>
          {alert &&
            alert.criteria &&
            alert.criteria[0].dimension_filters.length > 0 &&
            alert.criteria[0].dimension_filters.map((dim, idx) => (
              <Box key={`${dim.dimension_label}-${idx}`}>
                <Chip
                  label={`${dim.dimension_label} ${dim.operator} ${dim.value}`}
                  variant="outlined"
                />
              </Box>
            ))}
        </Grid>
      </Grid>
    </Box>
  );
};
