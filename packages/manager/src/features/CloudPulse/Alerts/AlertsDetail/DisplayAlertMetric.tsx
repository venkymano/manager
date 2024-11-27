import { Chip } from '@linode/ui';
import React from 'react';

interface AlertMetricProps {
  metricItems: string[];
}

export const DisplayAlertMetric = React.memo((props: AlertMetricProps) => {
  const { metricItems } = props;

  return metricItems.map((label, index) => (
    <Chip
      sx={{
        backgroundColor: 'white',
      }}
      key={index}
      label={label}
      variant="outlined"
    />
  ));
});
