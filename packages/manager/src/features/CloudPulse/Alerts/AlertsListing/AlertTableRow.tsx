import { Box } from '@linode/ui';
import * as React from 'react';

import { DateTimeDisplay } from 'src/components/DateTimeDisplay';
import { Link } from 'src/components/Link';
import { StatusIcon } from 'src/components/StatusIcon/StatusIcon';
import { TableCell } from 'src/components/TableCell';
import { TableRow } from 'src/components/TableRow';
import { capitalize } from 'src/utilities/capitalize';

import { AlertActionMenu } from './AlertActionMenu';

import type { Item } from '../constants';
import type { ActionHandlers } from './AlertActionMenu';
import type { Alert, AlertServiceType, AlertStatusType } from '@linode/api-v4';

interface Props {
  /**
   * alert details used by the component to fill the row details
   */
  alert: Alert;
  /**
   * The callback handlers for clicking an action menu item like Show Details, Delete, etc.
   */
  handlers: ActionHandlers;
  /**
   * services list for the reverse mapping to display the labels from the alert service values
   */
  services: Item<string, AlertServiceType>[];
}

const getStatus = (status: AlertStatusType) => {
  if (status === 'enabled') {
    return 'active';
  } else if (status === 'disabled') {
    return 'inactive';
  }
  return 'other';
};

export const AlertTableRow = (props: Props) => {
  const { alert, handlers, services } = props;
  const { created_by, id, label, service_type, status, type, updated } = alert;
  return (
    <TableRow data-qa-alert-cell={id} key={`alert-row-${id}`}>
      <TableCell>
        <Link to={`/monitor/cloudpulse/alerts/definitions/${id}`}>{label}</Link>
      </TableCell>
      <TableCell>
        <Box alignItems="center" display="flex">
          <StatusIcon data-testid="status-icon" status={getStatus(status)} />
          {capitalize(status)}
        </Box>
      </TableCell>
      <TableCell>
        {services.find((service) => service.value === service_type)?.label}
      </TableCell>
      <TableCell>{created_by}</TableCell>
      <TableCell>
        <DateTimeDisplay value={new Date(updated).toISOString()} />
      </TableCell>
      <TableCell>{created_by}</TableCell>
      <TableCell actionCell data-qa-alert-action-cell={`alert_${id}`}>
        <AlertActionMenu alertType={type} handlers={handlers} />
      </TableCell>
    </TableRow>
  );
};
