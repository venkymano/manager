import { TooltipIcon, Typography } from '@linode/ui';
import { useTheme } from '@mui/material/styles';
import * as React from 'react';

interface Props {
  dataTestId: string;
  headerText: string;
  tooltipText: string;
}

export const TransferDisplayDialogHeader = React.memo((props: Props) => {
  const { dataTestId, headerText, tooltipText } = props;
  const theme = useTheme();

  return (
    <Typography
      data-testid={dataTestId}
      sx={{ font: theme.font.bold }}
      fontSize={theme.typography.h3.fontSize}
    >
      {headerText}
      <TooltipIcon
        componentsProps={{
          tooltip: {
            style: {
              marginTop: -8,
              minWidth: 250,
            },
          },
        }}
        status="help"
        sxTooltipIcon={{ left: -2, top: -2 }}
        text={tooltipText}
      />
    </Typography>
  );
});
