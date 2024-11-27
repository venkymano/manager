import { Divider, Grid } from '@mui/material';
import React from 'react';

import NullComponent from 'src/components/NullComponent';
import { Typography } from 'src/components/Typography';

import { aggregationTypes, operators } from '../constants';
import { DisplayAlertDimensions } from './DisplayAlertDimensions';
import { DisplayAlertMetric } from './DisplayAlertMetric';

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
        <Grid container key={idx} rowGap={1}>
          <Grid item sm={3} xs={12}>
            <Typography variant="h3">Metric Threshold: </Typography>
          </Grid>
          <Grid item sm={9} xs={12}>
            <DisplayAlertMetric
              metricItems={[
                aggregation_type
                  ? aggregationTypes[aggregation_type]
                  : aggregation_type,
                metric,
                operator ? operators[operator] : operator,
                String(value),
              ]}
            />
          </Grid>
          <DisplayAlertDimensions
            dimensionFilterLabel={'Dimension Filter'}
            dimensionFilters={dimension_filters}
          />
          <Grid item sm={12} xs={12}>
            <Divider />
          </Grid>
        </Grid>
      )
    );
  }
);
