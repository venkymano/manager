import { Divider } from '@linode/ui';
import { Box } from '@linode/ui';
import { Grid, Typography } from '@mui/material';
import React from 'react';

import { Chip } from 'src/components/Chip';

import type { Alert } from '@linode/api-v4';

interface CriteriaProps {
  alert: Alert;
}

export const AlertDetailCriteria = (props: CriteriaProps) => {
  const { alert } = props;

  const {
    evaluation_period_seconds,
    polling_interval_seconds,
    trigger_occurrences,
  } = alert.triggerCondition;

  const { rule_criteria } = alert;

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
            {`${polling_interval_seconds} seconds`}
          </Typography>
        </Grid>
        <Grid item sm={3}>
          <Typography variant="h3">Evaluation period: </Typography>
        </Grid>
        <Grid item sm={9}>
          <Typography variant="body2">
            {`${evaluation_period_seconds} seconds`}
          </Typography>
        </Grid>
        <Grid item sm={3} xs={12}>
          <Typography variant="h3">Trigger alert when: </Typography>
        </Grid>
        <Grid item sm={9} xs={12}>
          <Typography variant="body2">
            {`All Criteria are met for ${trigger_occurrences} consecutive occurrence`}
          </Typography>
        </Grid>
        {rule_criteria &&
          rule_criteria.rules.length > 0 &&
          rule_criteria.rules.map(
            ({ aggregation_type, metric, operator, value }, idx) => (
              <Grid container key={idx} margin={1} spacing={1}>
                <Grid item sm={12} xs={12}>
                  <Divider />
                </Grid>
                <Grid item sm={3} xs={12}>
                  <Typography variant="h3">Threshold: </Typography>
                </Grid>
                <Grid item sm={9} xs={12}>
                  <Typography variant="body2">
                    {`${metric} ${aggregation_type} ${operator} ${value}`}
                  </Typography>
                </Grid>
              </Grid>
            )
          )}
      </Grid>
    </Box>
  );
};
