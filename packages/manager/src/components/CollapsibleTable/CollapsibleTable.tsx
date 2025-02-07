import * as React from 'react';

import { Table } from 'src/components/Table';
import { TableBody } from 'src/components/TableBody';
import { TableHead } from 'src/components/TableHead';

import { CollapsibleRow } from './CollapsibleRow';

export interface TableItem {
  InnerTable: JSX.Element;
  OuterTableCells: JSX.Element;
  id: number | string;
  label: string;
}

interface Props {
  TableItems: TableItem[];
  TableRowEmpty: JSX.Element;
  TableRowHead: JSX.Element;
  striped?: boolean;
}

export const CollapsibleTable = (props: Props) => {
  const { TableItems, TableRowEmpty, TableRowHead, striped = true } = props;

  return (
    <Table aria-label="collapsible table" nested striped={striped}>
      <TableHead data-qa-table-row="collapsible-table-headers-row">
        {TableRowHead}
      </TableHead>
      <TableBody>
        {TableItems.length === 0 && TableRowEmpty}
        {TableItems.map((item) => {
          return (
            <CollapsibleRow
              InnerTable={item.InnerTable}
              OuterTableCells={item.OuterTableCells}
              key={item.id}
              label={item.label}
            />
          );
        })}
      </TableBody>
    </Table>
  );
};
