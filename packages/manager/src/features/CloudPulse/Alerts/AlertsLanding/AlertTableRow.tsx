import { Typography } from '@linode/ui';
import * as React from 'react';

import { DateTimeDisplay } from 'src/components/DateTimeDisplay';
import { TableCell } from 'src/components/TableCell';
import { TableRow } from 'src/components/TableRow';

import { AlertActionMenu } from './AlertActionMenu';

import type { ActionHandlers } from './AlertActionMenu';
import type { Alert } from '@linode/api-v4';

interface Props {
  alert: Alert;
  handlers: ActionHandlers;
}

export const AlertTableRow = React.memo((props: Props) => {
  const { alert, handlers } = props;
  return (
    <TableRow data-qa-alert-cell={alert.id} key={`alert-row-${alert.id}`}>
      <TableCell colSpan={2}>{alert.label}</TableCell>
      <TableCell>{alert.service_type}</TableCell>
      <TableCell>{alert.severity}</TableCell>
      <TableCell>
        <Typography color={alert.status === 'enabled' ? 'limegreen' : 'gray'}>
          {alert.status}
        </Typography>
      </TableCell>
      <TableCell>{alert.type}</TableCell>
      <TableCell>
        <DateTimeDisplay value={alert.updated} />
      </TableCell>
      <TableCell>{alert.created_by}</TableCell>
      <TableCell actionCell>
        <AlertActionMenu alertType={alert.type} handlers={handlers} />
      </TableCell>
    </TableRow>
  );
});
