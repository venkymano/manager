import * as React from 'react';

import { TypeToConfirmDialog } from 'src/components/TypeToConfirmDialog/TypeToConfirmDialog';

import type { Alert } from '@linode/api-v4';

interface Props {
  alert: Alert | undefined;
  onClose: () => void;
  open: boolean;
}
export const DeleteAlertDialogue = (props: Props) => {
  const { alert, onClose, open } = props;

  const onDelete = () => {
    onClose();
  };

  return (
    <TypeToConfirmDialog
      entity={{
        action: 'deletion',
        name: alert?.label,
        primaryBtnText: 'Delete',
        type: 'Alert',
      }}
      label="Alert Name"
      loading={false}
      onClick={onDelete}
      onClose={onClose}
      open={open}
      title={`Delete Alert ${alert?.label}?`}
      typographyStyle={{ marginTop: '10px' }}
    />
  );
};
