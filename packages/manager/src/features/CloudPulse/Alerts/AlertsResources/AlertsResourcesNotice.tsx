import { Button, Notice } from '@linode/ui';
import { styled } from '@mui/material/styles';
import React from 'react';

interface AlertResourceNoticeProps {
  handleSelectionChange: () => void;
  selectedResources: number;
  totalResources: number;
}

export const AlertsResourcesNotice = React.memo(
  (props: AlertResourceNoticeProps) => {
    const { handleSelectionChange, selectedResources, totalResources } = props;

    return (
      <StyledNotice
        sx={{
          height: '54px',
        }}
        variant="info"
      >
        <b>
          {selectedResources} out of {totalResources} resources are selected{' '}
        </b>
        {selectedResources !== totalResources && (
          <Button
            sx={{
              mb: 0.5,
              minHeight: 'auto',
              minWidth: 'auto',
              p: 0,
            }}
            aria-label="Select All Resources"
            onClick={handleSelectionChange}
            variant="text"
          >
            Select all.
          </Button>
        )}
        {selectedResources === totalResources && (
          <Button
            sx={{
              mb: 0.5,
              minHeight: 'auto',
              minWidth: 'auto',
              p: 0,
            }}
            aria-label="Unselect All Resources"
            onClick={handleSelectionChange}
            variant="text"
          >
            Unselect all.
          </Button>
        )}
      </StyledNotice>
    );
  }
);

export const StyledNotice = styled(Notice, { label: 'StyledNotice' })(
  ({ theme }) => ({
    '&&': {
      p: {
        lineHeight: '1.25rem',
      },
    },
    alignItems: 'center',
    background: theme.bg.bgPaper,
    borderRadius: 1,
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(0),
    padding: theme.spacing(2),
  })
);
