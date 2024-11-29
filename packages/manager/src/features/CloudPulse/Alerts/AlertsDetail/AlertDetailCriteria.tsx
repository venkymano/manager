import { Chip } from '@linode/ui';
import { Grid, Typography, useTheme } from '@mui/material';
import React from 'react';

import { convertSecondsToMinutes } from '../Utils/utils';
import { DisplayAlertChips } from './AlertDetailChips';
import { DisplayAlertMetricAndDimensions } from './DisplayAlertMetricAndDimensions';

import type { Alert } from '@linode/api-v4';

interface CriteriaProps {
  alert: Alert;
}

export const AlertDetailCriteria = React.memo((props: CriteriaProps) => {
  const { alert } = props;

  const {
    evaluation_period_seconds,
    polling_interval_seconds,
    trigger_occurrences,
  } = alert.triggerCondition;

  const { rule_criteria = { rules: [] } } = alert;

  const theme = useTheme();

  return (
    <React.Fragment>
      <Typography
        fontSize={theme.spacing(2.25)}
        gutterBottom
        marginBottom={2}
        variant="h2"
      >
        Criteria
      </Typography>
      <Grid alignItems="center" container spacing={2}>
        <DisplayAlertMetricAndDimensions ruleCriteria={rule_criteria} />
        <Grid item xs={12}>
          <DisplayAlertChips // label chip for polling interval
            chips={[convertSecondsToMinutes(polling_interval_seconds)]}
            isJoin
            label={'Polling Interval'}
          />
        </Grid>
        <Grid item xs={12}>
          <DisplayAlertChips // label chip for evaluation period
            chips={[convertSecondsToMinutes(evaluation_period_seconds)]}
            isJoin
            label={'Evaluation Period'}
          />
        </Grid>
        <Grid item sm={4} xs={12}>
          <Typography fontSize={theme.spacing(1.75)} variant="h2">
            Trigger Alert When:
          </Typography>
        </Grid>
        <Grid
          sx={{
            display: 'flex',
          }}
          item
          sm={8}
          xs={12}
        >
          <Typography variant="body1">All Criteria are met for</Typography>
          <Chip
            sx={{
              backgroundColor: 'white',
              marginLeft: theme.spacing(0.5),
            }}
            label={trigger_occurrences}
            variant="outlined"
          />
          <Typography variant="body1">consecutive occurrence</Typography>
        </Grid>
      </Grid>
    </React.Fragment>
  );
});
