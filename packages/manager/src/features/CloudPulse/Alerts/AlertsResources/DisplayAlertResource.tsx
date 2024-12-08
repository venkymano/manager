import { TableBody, TableHead, useTheme } from '@mui/material';
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

  /**
   * Callback for clicking on check box
   */
  handleSelection?: (id: string[], isSelectAction: boolean) => void;

  /**
   * When a api call fails or any error occurs while loading the data, this property can be passes true
   */
  isDataLoadingError: boolean;

  /**
   * This controls whether to show the selection check box or not
   */
  isSelectionsNeeded?: boolean;

  /**
   * If this is passed in case of filteredResources are empty
   */
  noDataText?: string;

  /**
   * The pageSize needed in the table
   */
  pageSize: number;

  /**
   * Callback to scroll till to the top of the Resources title section
   */
  scrollToTitle: () => void;
}

export const DisplayAlertResources = React.memo(
  (props: DisplayAlertResourceProp) => {
    const {
      errorText,
      filteredResources,
      handleSelection,
      isDataLoadingError,
      isSelectionsNeeded = false,
      noDataText,
      pageSize,
      scrollToTitle,
    } = props;

    const [sorting, setSorting] = React.useState<{
      order: Order;
      orderBy: string;
    }>({
      order: 'asc',
      orderBy: 'label', // default order to be asc and orderBy will be label
    });

    const theme = useTheme();

    // The sorted data based on the selection in the table
    const sortedData = React.useMemo(() => {
      return sortData(
        sorting.orderBy,
        sorting.order
      )(filteredResources ?? []) as AlertInstances[];
    }, [filteredResources, sorting]);

    const handleSort = React.useCallback(
      (
        orderBy: string,
        order: Order | undefined,
        handlePageChange: (page: number) => void
      ) => {
        if (!order) {
          return;
        }

        setSorting({
          order,
          orderBy,
        });
        handlePageChange(1); // move to first page
        scrollToTitle(); // scroll to title
      },
      [scrollToTitle]
    );

    const handlePageNumberChange = React.useCallback(
      (handlePageChange: (page: number) => void, pageNumber: number) => {
        handlePageChange(pageNumber); // move to first page
        scrollToTitle(); // scroll to title
      },
      [scrollToTitle]
    );

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
          <React.Fragment>
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
                    handleClick={(orderBy, order) => {
                      handleSort(orderBy, order, handlePageChange);
                    }}
                    active={sorting.orderBy === 'label'}
                    data-qa-sortid="resource"
                    data-testid="resource"
                    direction={sorting.order}
                    label="label"
                  >
                    Resource
                  </TableSortCell>
                  <TableSortCell
                    handleClick={(orderBy, order) => {
                      handleSort(orderBy, order, handlePageChange);
                    }}
                    active={sorting.orderBy === 'region'}
                    data-qa-sortid="region"
                    data-testid="region"
                    direction={sorting.order}
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
                {paginatedData.length === 0 && (
                  <TableRow>
                    <TableCell
                      align="center"
                      colSpan={3}
                      height={theme.spacing(6)}
                    >
                      {noDataText ?? 'No results found'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {!isDataLoadingError && !noDataText && (
              <PaginationFooter
                handlePageChange={(page) => {
                  handlePageNumberChange(handlePageChange, page);
                }}
                handleSizeChange={(pageSize) => {
                  handlePageSizeChange(pageSize);
                  handlePageNumberChange(handlePageChange, 1); // move to first page
                }}
                count={count}
                eventCategory="alerts_resources"
                page={page}
                pageSize={pageSize}
              />
            )}
          </React.Fragment>
        )}
      </Paginate>
    );
  }
);
