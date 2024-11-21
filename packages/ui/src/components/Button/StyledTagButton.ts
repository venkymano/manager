import { omittedProps } from '../../utilities';
import { styled } from '@mui/material/styles';

import { PlusSignIcon } from '../../assets/icons';

import { Button } from './Button';

/**
 * A button for Tags. Eventually this treatment will go away,
 * but the sake of the MUI migration we need to keep it around for now, and as a styled component in order to get rid of
 * spreading excessive styles for everywhere this is used.
 *
 */
export const StyledTagButton = styled(Button, {
  label: 'StyledTagButton',
  shouldForwardProp: omittedProps(['panel']),
})<{ panel?: boolean }>(({ theme, ...props }) => ({
  border: 'none',
  fontSize: '0.875rem',
  minHeight: 30,
  whiteSpace: 'nowrap',
  ...(props.panel && {
    height: 34,
  }),
  ...(!props.disabled && {
    '&:hover, &:focus': {
      backgroundColor: theme.color.tagButtonBg,
      border: 'none',
      color: theme.color.tagButtonText,
    },
    backgroundColor: theme.color.tagButtonBg,
    color: theme.color.tagButtonText,
  }),
}));

export const StyledPlusIcon = styled(PlusSignIcon, {
  label: 'StyledPlusIcon',
})(({ theme, ...props }) => ({
  color: props.disabled
    ? theme.name === 'dark'
      ? '#5c6470'
      : theme.color.disabledText
    : theme.color.tagIcon,
  height: '10px',
  width: '10px',
}));
