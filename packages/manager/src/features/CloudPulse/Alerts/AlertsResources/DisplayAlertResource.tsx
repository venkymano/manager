import { Box } from '@linode/ui';
import { TableBody, TableHead, styled } from '@mui/material';
import React from 'react';

import { Checkbox } from 'src/components/Checkbox';
import { sortData } from 'src/components/OrderBy';
import Paginate from 'src/components/Paginate';
import { PaginationFooter } from 'src/components/PaginationFooter/PaginationFooter';
import { Table } from 'src/components/Table/Table';
import { TableCell } from 'src/components/TableCell';
import { TableRow } from 'src/components/TableRow/TableRow';
import { TableRowError } from 'src/components/TableRowError/TableRowError';
import { TableSortCell } from 'src/components/TableSortCell';

import type { Order } from 'src/hooks/useOrder';

export interface AlertInstances {
  checked: boolean;
  id: string;
  label: string;
  region?: string;
}

export interface DisplayAlertResourceProp {
  errorText: string;

  /**
   * The resources that needs to be displayed
   */
  filteredResources: AlertInstances[] | undefined;

  handleSelection?: (id: string[], isSelectAction: boolean) => void;

  isDataLoadingError: boolean;

  /**
   * This controls whether to show the selection check box or not
   */
  isSelectionsNeeded?: boolean;

  /**
   * The pageSize needed in the table
   */
  pageSize: number;
}

export const DisplayAlertResources = React.memo(
  (props: DisplayAlertResourceProp) => {
    const {
      errorText,
      filteredResources,
      handleSelection,
      isDataLoadingError,
      isSelectionsNeeded = false,
      pageSize,
    } = props;

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
      )(filteredResources ?? []) as AlertInstances[];
    }, [filteredResources, sorting]);

    const handleSort = React.useCallback((orderBy: string, order: Order) => {
      setSorting({
        order,
        orderBy,
      });
    }, []);

    const handleSelectionChange = React.useCallback(
      (id: string[], isSelectionAction: boolean) => {
        if (handleSelection) {
          handleSelection(id, isSelectionAction);
        }
      },
      [handleSelection]
    );

    const isAllPageSelected = (paginatedData: AlertInstances[]): boolean => {
      return (
        Boolean(paginatedData?.length) &&
        paginatedData.every((resource) => resource.checked)
      );
    };

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
          <Table>
            <TableHead>
              <TableRow>
                {isSelectionsNeeded && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      onClick={() =>
                        handleSelectionChange(
                          paginatedData.map((resource) => resource.id),
                          !isAllPageSelected(paginatedData)
                        )
                      }
                      sx={{
                        padding: 0,
                      }}
                      checked={isAllPageSelected(paginatedData)}
                    />
                  </TableCell>
                )}
                <TableSortCell
                  active={sorting.orderBy === 'label'}
                  direction={sorting.order}
                  handleClick={handleSort}
                  label="label"
                >
                  Resource
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
              {!isDataLoadingError &&
                paginatedData.map(({ checked, id, label, region }) => (
                  <TableRow key={id}>
                    {isSelectionsNeeded && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          onChange={() => {
                            handleSelectionChange([id], !checked);
                          }}
                          sx={{
                            padding: 0,
                          }}
                          checked={checked}
                        />
                      </TableCell>
                    )}
                    <TableCell>{label}</TableCell>
                    <TableCell>{region}</TableCell>
                  </TableRow>
                ))}
              {isDataLoadingError && (
                <TableRowError
                  colSpan={3}
                  message={errorText ?? 'Table data is unavailable.'}
                />
              )}
              {!isDataLoadingError && (
                <TableRow>
                  <TableCell colSpan={3} height={'48px'}>
                    <PaginationFooter
                      count={count}
                      eventCategory="alerts_resources"
                      handlePageChange={handlePageChange}
                      handleSizeChange={handlePageSizeChange}
                      page={page}
                      pageSize={pageSize}
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Paginate>
    );
  }
);
