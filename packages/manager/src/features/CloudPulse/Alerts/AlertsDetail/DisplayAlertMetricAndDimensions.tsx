import { Divider, Grid } from '@mui/material';
import React from 'react';

import NullComponent from 'src/components/NullComponent';

import { aggregationTypes, operators } from '../constants';
import { DisplayAlertChips } from './DisplayAlertChips';

import type { MetricCriteria } from '@linode/api-v4';

interface AlertMetricAndDimensionsProp {
  ruleCriteria: {
    rules: MetricCriteria[];
  };
}

export const DisplayAlertMetricAndDimensions = React.memo(
  (props: AlertMetricAndDimensionsProp) => {
    const { ruleCriteria } = props;

    if (!Boolean(ruleCriteria.rules?.length)) {
      return <NullComponent />;
    }

    return ruleCriteria.rules.map(
      (
        { aggregation_type, dimension_filters, metric, operator, value },
        idx
      ) => (
        <React.Fragment key={idx}>
          <Grid item xs={12}>
            <DisplayAlertChips
              chips={[
                aggregation_type
                  ? aggregationTypes[aggregation_type]
                  : aggregation_type,
                metric,
                operator ? operators[operator] : operator,
                String(value),
              ]}
              isJoin
              label={'Metric Threshold'}
            />
          </Grid>
          <Grid item xs={12}>
            <DisplayAlertChips
              chips={dimension_filters.map(
                ({ dimension_label, operator, value }) => [
                  dimension_label,
                  operator,
                  value,
                ]
              )}
              isJoin
              label={'Dimension Filter'}
            />
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
        </React.Fragment>
      )
    );
  }
);
