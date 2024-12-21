import * as React from 'react';

import { ActionMenu } from 'src/components/ActionMenu/ActionMenu';

import { getAlertTypeToActionsList } from '../Utils/AlertsActionMenu';

import type { AlertDefinitionType } from '@linode/api-v4';

export interface ActionHandlers {
  // These handlers will be enhanced based on the alert type and actions required
  /*
   * Callback for delete action
   */
  handleDelete: () => void;

  /*
   * Callback for show details action
   */
  handleDetails: () => void;
}

export interface AlertActionMenuProps {
  /*
   * Type of the alert
   */
  alertType: AlertDefinitionType;
  /*
   * Handlers for alert actions like Delete, Show Details etc.
   */
  handlers: ActionHandlers;
}

export const AlertActionMenu = (props: AlertActionMenuProps) => {
  const { alertType, handlers } = props;

  const actions = React.useMemo(() => {
    return getAlertTypeToActionsList(handlers)[alertType] || [];
  }, [alertType, handlers]); // recompute the actions only if the alert type and handler changes

  return (
    <ActionMenu actionsList={actions} ariaLabel={'Action menu for Alert'} />
  );
};
