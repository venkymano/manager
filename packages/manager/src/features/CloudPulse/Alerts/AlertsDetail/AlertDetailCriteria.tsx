import { Box } from '@linode/ui';
import { Grid, Typography, useTheme } from '@mui/material';
import React from 'react';

import { DisplayAlertMetricAndDimensions } from './DisplayAlertMetricAndDimensions';

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

  const theme = useTheme();

  return (
    <Box
      sx={(theme) => ({
        backgroundColor:
          theme.name === 'light' ? theme.color.grey5 : theme.color.grey9,
        borderRadius: 1,
        p: 1,
      })}
      height={theme.spacing(90)}
      maxHeight={theme.spacing(90)}
      overflow={'auto'}
      p={theme.spacing(3)}
    >
      <Typography gutterBottom marginBottom={2} variant="h2">
        Criteria
      </Typography>
      {/** Display alerts metrics and dimensions */}
      <DisplayAlertMetricAndDimensions ruleCriteria={rule_criteria} />{' '}
      {/** Display rest of the information */}
      <Grid alignItems="center" container id="ds" spacing={2}>
        <Grid item marginTop={1} sm={3}>
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
          <Typography variant="h3">Trigger Alert When: </Typography>
        </Grid>
        <Grid item sm={9} xs={12}>
          <Typography variant="body2">
            {`All Criteria are met for ${trigger_occurrences} consecutive occurrence`}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};
