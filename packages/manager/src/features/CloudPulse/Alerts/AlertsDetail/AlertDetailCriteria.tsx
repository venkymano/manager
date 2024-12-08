import { Grid, Typography, useTheme } from '@mui/material';
import React from 'react';

import { convertSecondsToMinutes } from '../Utils/utils';
import { StyledAlertChip } from './AlertDetail';
import { DisplayAlertChips } from './AlertDetailChips';
import { DisplayAlertMetricAndDimensions } from './DisplayAlertMetricAndDimensions';

import type { Alert } from '@linode/api-v4';

interface CriteriaProps {
  /*
   * The alert for which the criteria is displayed
   */
  alert: Alert;
}

export const AlertDetailCriteria = React.memo((props: CriteriaProps) => {
  const { alert } = props;

  const {
    evaluation_period_seconds: evaluationPeriod,
    polling_interval_seconds: pollingIntervalSeconds,
    trigger_occurrences: triggerOccurrences,
  } = alert.triggerCondition;

  const { rule_criteria: ruleCriteria = { rules: [] } } = alert;

  const theme = useTheme();

  // Memoized trigger criteria rendering
  const renderTriggerCriteria = React.useMemo(
    () => (
      <Grid alignItems="center" container item md={8} xs={12}>
        <StyledAlertChip
          borderRadius={theme.spacing(0.3)}
          label={'All'}
          variant="outlined"
        />
        <Typography
          color={theme.color.offBlack}
          marginRight={0.5}
          variant="body1"
        >
          criteria are met for
        </Typography>
        <StyledAlertChip
          borderRadius={theme.spacing(0.3)}
          label={` ${triggerOccurrences}`}
          variant="outlined"
        />
        <Typography color={theme.color.offBlack} variant="body1">
          consecutive occurrences.
        </Typography>
      </Grid>
    ),
    [theme, triggerOccurrences]
  );

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
        <DisplayAlertMetricAndDimensions ruleCriteria={ruleCriteria} />
        <Grid item xs={12}>
          <DisplayAlertChips // label chip for polling interval
            chips={[convertSecondsToMinutes(pollingIntervalSeconds)]}
            isJoin
            label={'Polling Interval'}
          />
        </Grid>
        <Grid item xs={12}>
          <DisplayAlertChips // label chip for evaluation period
            chips={[convertSecondsToMinutes(evaluationPeriod)]}
            isJoin
            label={'Evaluation Period'}
          />
        </Grid>
        <Grid item sm={4} xs={12}>
          <Typography fontSize={theme.spacing(1.75)} variant="h2">
            Trigger Alert When:
          </Typography>
        </Grid>
        {renderTriggerCriteria}
      </Grid>
    </React.Fragment>
  );
});
