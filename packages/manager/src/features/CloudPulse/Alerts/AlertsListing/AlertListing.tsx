import { Paper } from '@linode/ui';
import { Grid } from '@mui/material';
import React from 'react';
import { useHistory } from 'react-router-dom';

import AlertIcon from 'src/assets/icons/entityIcons/alert.svg';
import { Table } from 'src/components/Table';
import { TableBody } from 'src/components/TableBody';
import { TableCell } from 'src/components/TableCell';
import { TableHead } from 'src/components/TableHead';
import { TableRow } from 'src/components/TableRow';
import { TableRowError } from 'src/components/TableRowError/TableRowError';
import { TableRowLoading } from 'src/components/TableRowLoading/TableRowLoading';
import { TableSortCell } from 'src/components/TableSortCell';
import { StyledPlaceholder } from 'src/features/StackScripts/StackScriptBase/StackScriptBase.styles';
import { useAllAlertDefinitionsQuery } from 'src/queries/cloudpulse/alerts';

import { AlertTableRow } from './AlertTableRow';

import type { Alert } from '@linode/api-v4';

export const AlertListing = () => {
  // These are dummy order and handlers, will replace them in the next PR
  const order = 'asc';
  const handleOrderChange = () => {
    return 'asc';
  };
  const { data: alerts, isError, isLoading } = useAllAlertDefinitionsQuery();

  const history = useHistory();

  const handleDetails = (alert: Alert) => {
    history.push(
      `${location.pathname}/detail/${alert.service_type}/${alert.id}`
    );
  };

  if (alerts?.length === 0) {
    return (
      <Grid item xs={12}>
        <Paper>
          <StyledPlaceholder
            icon={AlertIcon}
            subtitle="Start Monitoring your resources."
            title=""
          />
        </Paper>
      </Grid>
    );
  }
  return (
    <Grid marginTop={2}>
      <Table colCount={7} size="small">
        <TableHead>
          <TableRow>
            <TableSortCell
              active={true}
              direction={order}
              handleClick={handleOrderChange}
              label="alertName"
            >
              Alert Name
            </TableSortCell>
            <TableSortCell
              handleClick={() => {
                'asc';
              }}
              active={true}
              direction={order}
              label="serviceType"
              size="small"
            >
              Service Type
            </TableSortCell>
            <TableSortCell
              active={true}
              direction={order}
              handleClick={handleOrderChange}
              label="severity"
            >
              Severity
            </TableSortCell>
            <TableSortCell
              active={true}
              direction={order}
              handleClick={handleOrderChange}
              label="status"
            >
              Status
            </TableSortCell>
            <TableSortCell
              active={true}
              direction={order}
              handleClick={handleOrderChange}
              label="lastModified"
            >
              Last Modified
            </TableSortCell>
            <TableSortCell
              active={true}
              direction={order}
              handleClick={handleOrderChange}
              label="createdBy"
              size="small"
            >
              Created By
            </TableSortCell>
            <TableCell actionCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {isError === true && (
            <TableRowError
              colSpan={7}
              message={'Error in fetching the alerts.'}
            />
          )}
          {isLoading === true && <TableRowLoading columns={7} />}
          {alerts?.map((alert) => (
            <AlertTableRow
              handlers={{
                handleDetails: () => handleDetails(alert),
              }}
              alert={alert}
              key={alert.id}
            />
          ))}
        </TableBody>
      </Table>
    </Grid>
  );
};
