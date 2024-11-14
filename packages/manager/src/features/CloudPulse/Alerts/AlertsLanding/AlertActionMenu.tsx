import * as React from 'react';

import { ActionMenu } from 'src/components/ActionMenu/ActionMenu';
import { getRestrictedResourceText } from 'src/features/Account/utils';

import type { Action } from 'src/components/ActionMenu/ActionMenu';

export interface ActionHandlers {
  handleDelete: () => void;
  handleDetails: () => void;
}

export interface Props {
  alert: any;
  handlers: ActionHandlers;
}

export const AlertActionMenu = (props: Props) => {
  const { handlers } = props;
  const actions: Action[] = [
    {
      disabled: false,
      onClick: handlers.handleDetails,
      title: 'Show Details',
      tooltip: false
        ? getRestrictedResourceText({
            action: 'view',
            isSingular: true,
            resourceType: 'Alerts',
          })
        : undefined,
    },
    {
      disabled: false,
      onClick: handlers.handleDelete,
      title: 'Delete',
      tooltip: false
        ? getRestrictedResourceText({
            action: 'delete',
            isSingular: true,
            resourceType: 'Alerts',
          })
        : undefined,
    },
  ];

  return (
    <ActionMenu actionsList={actions} ariaLabel={`Action menu for Alert`} />
  );
};
