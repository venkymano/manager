import { Chip } from '@linode/ui';
import Grid from '@mui/material/Grid';
import React from 'react';

import { Typography } from 'src/components/Typography';

import { operatorLabel } from '../constants';

import type { DimensionFilter } from '@linode/api-v4';

interface AlertDimensionsProp {
  dimensionFilterLabel: string;
  dimensionFilters: DimensionFilter[];
}

export const DisplayAlertDimensions = React.memo(
  (props: AlertDimensionsProp) => {
    const { dimensionFilterLabel, dimensionFilters } = props;

    return dimensionFilters.map(({ dimension_label, operator, value }, idx) => (
      <React.Fragment key={idx}>
        <Grid item key={idx} sm={3} xs={12}>
          {idx === 0 && (
            <Typography variant="h3">{dimensionFilterLabel}: </Typography>
          )}
        </Grid>
        <Grid item key={dimension_label} sm={9} xs={12}>
          <Chip
            label={`${dimension_label} ${
              operator ? operatorLabel[operator] : operator
            } ${value}`}
            sx={{
              backgroundColor: 'white',
              m: 0,
              p: 0,
            }}
            variant="outlined"
          />
        </Grid>
      </React.Fragment>
    ));
  }
);
