import { getRestrictedResourceText } from 'src/features/Account/utils';

import type { ActionHandlers } from '../AlertsLanding/AlertActionMenu';
import type { Action } from 'src/components/ActionMenu/ActionMenu';

/**
 *
 * @param onClickHandlers The list of handlers required to be called, on click of an action
 * @returns The actions based on the type of the alert
 */
export const getAlertTypeToActionsList = (
  onClickHandlers: ActionHandlers
): Record<string, Action[]> => ({
  system: [
    {
      disabled: false,
      onClick: onClickHandlers.handleDetails,
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
      onClick: onClickHandlers.handleDelete,
      title: 'Delete',
      tooltip: false
        ? getRestrictedResourceText({
            action: 'delete',
            isSingular: true,
            resourceType: 'Alerts',
          })
        : undefined,
    },
  ],
  // for now there is system and user alert types, may be in future more alert types can be added
  user: [
    {
      disabled: false,
      onClick: onClickHandlers.handleDetails,
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
      onClick: onClickHandlers.handleDelete,
      title: 'Delete',
      tooltip: false
        ? getRestrictedResourceText({
            action: 'delete',
            isSingular: true,
            resourceType: 'Alerts',
          })
        : undefined,
    },
    {
      disabled: true,
      onClick: () => {},
      title: 'Clone',
      tooltip: false
        ? getRestrictedResourceText({
            action: 'clone',
            isSingular: true,
            resourceType: 'Alerts',
          })
        : undefined,
    },
  ],
});
