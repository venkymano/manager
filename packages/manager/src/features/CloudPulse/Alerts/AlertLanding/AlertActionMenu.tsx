import { Volume } from '@linode/api-v4';
import { Theme, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { splitAt } from 'ramda';
import * as React from 'react';

import { Action, ActionMenu } from 'src/components/ActionMenu/ActionMenu';
import { InlineMenuAction } from 'src/components/InlineMenuAction/InlineMenuAction';
import { getRestrictedResourceText } from 'src/features/Account/utils';
import { useIsResourceRestricted } from 'src/hooks/useIsResourceRestricted';

export interface ActionHandlers {
//   handleAttach: () => void;
//   handleClone: () => void;
//   handleDelete: () => void;
//   handleDetach: () => void;
  handleDetails: () => void;
//   handleEdit: () => void;
//   handleResize: () => void;
//   handleUpgrade: () => void;
}

export interface Props {
  handlers: ActionHandlers;
//   isVolumesLanding: boolean;
  alert: any;
}

export const AlertActionMenu = (props: Props) => {
  const { handlers, } = props;

//   const attached = volume.linode_id !== null;

  const theme = useTheme<Theme>();
  const matchesSmDown = useMediaQuery(theme.breakpoints.down('md'));

//   const isVolumeReadOnly = useIsResourceRestricted({
//     grantLevel: 'read_only',
//     grantType: 'volume',
//     id: volume.id,
//   });

  const actions: Action[] = [
    // {
    //   onClick: handlers.handleDetails,
    //   title: 'Show Config',
    // },
    // {
    //   disabled: isVolumeReadOnly,
    //   onClick: handlers.handleEdit,
    //   title: 'Edit',
    //   tooltip: isVolumeReadOnly
    //     ? getRestrictedResourceText({
    //         action: 'edit',
    //         isSingular: true,
    //         resourceType: 'Volumes',
    //       })
    //     : undefined,
    // },
    {
      disabled: false,
      onClick: handlers.handleDetails,
      title: 'Show Details',
      tooltip: false
        ? getRestrictedResourceText({
            action: 'resize',
            isSingular: true,
            resourceType: 'Volumes',
          })
        : undefined,
    },
    {
      disabled: false,
      onClick: handlers.handleDetails,
      title: 'Clone',
      tooltip: false
        ? getRestrictedResourceText({
            action: 'clone',
            isSingular: true,
            resourceType: 'Volumes',
          })
        : undefined,
    },
  ];

  const splitActionsArrayIndex = matchesSmDown ? 0 : 2;
  const [inlineActions, menuActions] = splitAt(splitActionsArrayIndex, actions);

  return (
    <>
      {/* {!matchesSmDown &&
        inlineActions.map((action) => {
          return (
            <InlineMenuAction
              actionText={action.title}
              disabled={action.disabled}
              key={action.title}
              onClick={action.onClick}
              tooltip={action.tooltip}
            />
          );
        })} */}
      <ActionMenu
        actionsList={actions}
        ariaLabel={`Action menu for Alert`}
      />
    </>
  );
};
