import { Grid } from '@mui/material';
import React from 'react';

import { Typography } from 'src/components/Typography';

import { StyledAlertChip } from './AlertDetail';

interface AlertDimensionsProp {
  chips: Array<string> | Array<string[]>;
  label: string;
}

export const DisplayAlertChips = React.memo((props: AlertDimensionsProp) => {
  const { chips: values, label } = props;

  const iterables: string[][] =
    Array.isArray(values) && values.every((item) => Array.isArray(item))
      ? values
      : [values];

  return iterables.map((value, idx) => (
    <React.Fragment key={label + '_' + idx}>
      <Grid item sm={3} xs={12}>
        {idx === 0 && <Typography variant="h3">{label}: </Typography>}
      </Grid>
      <Grid item sm={6} xs={12}>
        {value.map((label, index) => (
          <StyledAlertChip key={index} label={label} variant="outlined" />
        ))}
      </Grid>
    </React.Fragment>
  ));
});
