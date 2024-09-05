import * as React from 'react';

import { TableCell } from 'src/components/TableCell';
import { TableRow } from 'src/components/TableRow';
import { Typography } from 'src/components/Typography';

import { AlertActionMenu } from './AlertActionMenu';

import type { ActionHandlers } from './AlertActionMenu';

interface Props {
  alert: any;
  handlers: ActionHandlers;
}

export const AlertTableRow = React.memo((props: Props) => {
  const { alert, handlers } = props;
  return (
    <TableRow data-qa-alert-cell={alert.id} key={`alert-row-${alert.id}`}>
      <TableCell colSpan={2}>{alert.name}</TableCell>
      <TableCell>{alert.serviceType}</TableCell>
      <TableCell>{alert.severity}</TableCell>
      <TableCell>
        <Typography color={alert.status === 'Enabled' ? 'limegreen' : 'gray'}>
          {alert.status}
        </Typography>
      </TableCell>
      <TableCell>{alert.lastModified}</TableCell>
      <TableCell>{alert.createdBy}</TableCell>
      <TableCell actionCell>
        <AlertActionMenu alert={alert} handlers={handlers} />
      </TableCell>
    </TableRow>
  );
});
