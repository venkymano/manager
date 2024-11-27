import { Chip } from '@linode/ui';
import { Grid, Typography } from '@mui/material';
import React from 'react';

import { convertSecondsToMinutes } from '../Utils/utils';
import { StyledAlertsBox } from './AlertDetail';
import { DisplayAlertChips } from './DisplayAlertChips';
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

  return (
    <StyledAlertsBox padding={3}>
      <Typography gutterBottom marginBottom={2} variant="h2">
        Criteria
      </Typography>

      <DisplayAlertMetricAndDimensions ruleCriteria={rule_criteria} />

      <Grid alignItems="center" columnGap={3} container rowGap={2}>
        <DisplayAlertChips // label chip for polling interval
          chips={[convertSecondsToMinutes(polling_interval_seconds)]}
          label={'Polling Interval'}
        />

        <DisplayAlertChips // label chip for evaluation period
          chips={[convertSecondsToMinutes(evaluation_period_seconds)]}
          label={'Evaluation Period'}
        />

        <Grid item sm={3} xs={12}>
          <Typography variant="h3">Trigger Alert When: </Typography>
        </Grid>
        <Grid
          sx={{
            display: 'flex',
          }}
          item
          sm={8}
          xs={12}
        >
          <Typography marginLeft={-1} variant="body1">
            All Criteria are met for{' '}
          </Typography>
          <Chip
            sx={{
              backgroundColor: 'white',
              marginLeft: 0.5,
            }}
            label={trigger_occurrences}
            variant="outlined"
          />
          <Typography variant="body1">consecutive occurrence</Typography>
        </Grid>
      </Grid>
    </StyledAlertsBox>
  );
});
