import { Grid, useTheme } from '@mui/material';
import React from 'react';

import { Typography } from 'src/components/Typography';

import { StyledAlertChip } from './AlertDetail';

interface AlertDimensionsProp {
  chips: Array<string> | Array<string[]>;
  isJoin?: boolean;
  label: string;
}

export const DisplayAlertChips = React.memo((props: AlertDimensionsProp) => {
  const { chips: values, isJoin = false, label } = props;

  const iterables: string[][] =
    Array.isArray(values) && values.every((item) => Array.isArray(item))
      ? values
      : [values];

  const theme = useTheme();

  return (
    <Grid container>
      {iterables.map((value, idx) => (
        <React.Fragment key={idx}>
          <Grid item md={4} xs={12}>
            {idx === 0 && <Typography variant="h3">{label}: </Typography>}
          </Grid>
          <Grid item md={8} xs={12}>
            <Grid container display={'flex'} flexWrap={'nowrap'}>
              {value.map((label, index) => (
                <Grid item key={index} marginLeft={isJoin ? -1 : 1}>
                  <StyledAlertChip
                    borderRadius={
                      value.length === 1
                        ? theme.spacing(0.3)
                        : index === 0
                        ? `${theme.spacing(0.3)} 0 0 ${theme.spacing(0.3)}` // First chip
                        : index === value.length - 1
                        ? `0 ${theme.spacing(0.3)} ${theme.spacing(0.3)} 0` // Last chip
                        : '0' // Middle chips
                    }
                    key={index}
                    label={label}
                    variant="outlined"
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </React.Fragment>
      ))}
    </Grid>
  );
});
