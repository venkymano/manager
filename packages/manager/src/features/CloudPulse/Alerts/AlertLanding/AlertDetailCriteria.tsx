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

  return (
    <Box
      sx={(theme) => ({
        backgroundColor:
          theme.name === 'light' ? theme.color.grey5 : theme.color.grey9,
        borderRadius: 1,
        p: 1,
      })}
      height={'500px'}
      overflow={'auto'}
      p={3}
    >
      <Typography gutterBottom marginBottom={2} variant="h2">
        Criteria
      </Typography>
      <Grid alignItems="center" container id="ds" spacing={2}>
        <Grid item sm={3}>
          <Typography variant="h3">Polling interval: </Typography>
        </Grid>
        <Grid item sm={9}>
          <Typography variant="body2">
            {`${alert.triggerCondition.polling_interval_seconds} seconds`}
          </Typography>
        </Grid>
        <Grid item sm={3}>
          <Typography variant="h3">Evaluation period: </Typography>
        </Grid>
        <Grid item sm={9}>
          <Typography variant="body2">
            {`${alert.triggerCondition.evaluation_period_seconds} seconds`}
          </Typography>
        </Grid>
        <Grid item sm={3} xs={12}>
          <Typography variant="h3">Trigger alert when: </Typography>
        </Grid>
        <Grid item sm={9} xs={12}>
          <Typography variant="body2">
            {`${alert.triggerCondition.criteria_condition} Criteria are met for ${alert.triggerCondition.trigger_occurrences} consecutive occurance`}
          </Typography>
        </Grid>
        {alert &&
          alert.criteria &&
          alert.criteria.length > 0 &&
          alert.criteria.map((metric, idx) => (
            <Grid container key={idx} margin={1} spacing={1}>
              <Grid item sm={12} xs={12}>
                <Divider />
              </Grid>
              <Grid item sm={3} xs={12}>
                <Typography variant="h3">Threshold: </Typography>
              </Grid>
              <Grid item sm={9} xs={12}>
                <Typography variant="body2">
                  {`${metric.metric} ${metric.aggregation_type} ${metric.operator} ${metric.value}`}
                </Typography>
              </Grid>
              <Grid item sm={3} xs={12}>
                <Typography variant="h3">Dimension filter: </Typography>
              </Grid>
              <Grid item sm={9} xs={12}>
                {metric &&
                  metric.dimension_filters.length > 0 &&
                  metric.dimension_filters.map((dim, idx) => (
                    <Box key={`${dim.dimension_label}-${idx}`}>
                      <Chip
                        label={`${dim.dimension_label} ${dim.operator} ${dim.value}`}
                        variant="outlined"
                      />
                    </Box>
                  ))}
              </Grid>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};
