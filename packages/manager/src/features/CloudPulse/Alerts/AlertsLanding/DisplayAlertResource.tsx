import { TableBody, TableHead } from '@mui/material';
import React from 'react';

import { sortData } from 'src/components/OrderBy';
import Paginate from 'src/components/Paginate';
import { PaginationFooter } from 'src/components/PaginationFooter/PaginationFooter';
import { Table } from 'src/components/Table/Table';
import { TableCell } from 'src/components/TableCell';
import { TableRow } from 'src/components/TableRow/TableRow';
import { TableSortCell } from 'src/components/TableSortCell';

import type { CloudPulseResources } from '../../shared/CloudPulseResourcesSelect';
import type { Order } from 'src/hooks/useOrder';

export interface DisplayAlertResourceProp {
  /**
   * The resources that needs to be displayed
   */
  filteredResources: CloudPulseResources[] | undefined;
  /**
   * The pageSize needed in the table
   */
  pageSize: number;
}

export const DisplayAlertResources = React.memo(
  (props: DisplayAlertResourceProp) => {
    const { filteredResources, pageSize } = props;

    const [sorting, setSorting] = React.useState<{
      order: Order;
      orderBy: string;
    }>({
      order: 'asc',
      orderBy: 'label', // default order to be asc and orderBy will be label
    });

    // The sorted data based on the selection in the table
    const sortedData = React.useMemo(() => {
      return sortData(
        sorting.orderBy,
        sorting.order
      )(filteredResources ?? []) as CloudPulseResources[];
    }, [filteredResources, sorting]);

    const handleSort = React.useCallback((orderBy: string, order: Order) => {
      setSorting({
        order,
        orderBy,
      });
    }, []);

    return (
      <Paginate data={sortedData ?? []} pageSize={pageSize}>
        {({
          count,
          data: paginatedData,
          handlePageChange,
          handlePageSizeChange,
          page,
          pageSize,
        }) => (
          <React.Fragment>
            <Table>
              <TableHead>
                <TableRow>
                  <TableSortCell
                    active={sorting.orderBy === 'label'}
                    direction={sorting.order}
                    handleClick={handleSort}
                    label="label"
                  >
                    Resources
                  </TableSortCell>
                  <TableSortCell
                    active={sorting.orderBy === 'region'}
                    direction={sorting.order}
                    handleClick={handleSort}
                    label="region"
                  >
                    Region
                  </TableSortCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell align="center" colSpan={2}>
                      No resources found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map(({ id, label, region }) => (
                    <TableRow key={id}>
                      <TableCell>{label}</TableCell>
                      <TableCell>{region}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <PaginationFooter
              count={count}
              eventCategory="alerts_resources"
              handlePageChange={handlePageChange}
              handleSizeChange={handlePageSizeChange}
              page={page}
              pageSize={pageSize}
            />
          </React.Fragment>
        )}
      </Paginate>
    );
  }
);
