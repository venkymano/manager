import { TableBody, TableHead } from '@mui/material';
import React from 'react';

import OrderBy, { sortData } from 'src/components/OrderBy';
import Paginate from 'src/components/Paginate';
import { PaginationFooter } from 'src/components/PaginationFooter/PaginationFooter';
import { Table } from 'src/components/Table/Table';
import { TableCell } from 'src/components/TableCell';
import { TableRow } from 'src/components/TableRow/TableRow';
import { TableSortCell } from 'src/components/TableSortCell';

import type { CloudPulseResources } from '../../shared/CloudPulseResourcesSelect';
import type { Region } from '@linode/api-v4';

export interface DisplayAlertResourceProp {
  filteredResources: CloudPulseResources[] | undefined;
  pageSize: number;
  regionsIdToLabelMap: Map<string, Region>;
}

export const DisplayAlertResources = React.memo(
  (props: DisplayAlertResourceProp) => {
    const { filteredResources, pageSize, regionsIdToLabelMap } = props;

    const [sortedData, setSortedData] = React.useState(filteredResources);
    const orderObj = React.useRef('asc');
    const orderByObj = React.useRef('label');

    const handleSort = React.useCallback(
      (orderBy: string, order: string) => {
        setSortedData(
          sortData(
            orderBy,
            order === 'asc' ? 'asc' : 'desc'
          )(filteredResources ?? []) as CloudPulseResources[]
        );
        orderObj.current = order;
        orderByObj.current = orderBy;
      },
      [filteredResources]
    );

    React.useEffect(() => {
      setSortedData(
        sortData(
          orderByObj.current,
          orderObj.current === 'asc' ? 'asc' : 'desc'
        )(filteredResources ?? []) as CloudPulseResources[]
      );
    }, [filteredResources]);

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
            <Table
              sx={{
                paddingTop: 2,
              }}
            >
              <TableHead>
                <TableRow>
                  <TableSortCell
                    handleClick={(orderBy, order) =>
                      handleSort(orderBy, order ?? 'asc')
                    }
                    active={orderByObj.current === 'label'}
                    direction={orderObj.current === 'asc' ? 'asc' : 'desc'}
                    label="label"
                  >
                    Resources
                  </TableSortCell>
                  <TableSortCell
                    handleClick={(orderBy, order) =>
                      handleSort(orderBy, order ?? 'asc')
                    }
                    active={orderByObj.current === 'region'}
                    direction={orderObj.current === 'asc' ? 'asc' : 'desc'}
                    label="region"
                  >
                    Region
                  </TableSortCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData?.map((resource) => {
                  return (
                    <TableRow key={resource.id}>
                      <TableCell>{resource.label}</TableCell>
                      <TableCell>
                        {resource.region
                          ? regionsIdToLabelMap.has(resource.region)
                            ? regionsIdToLabelMap.get(resource.region)?.label
                            : resource.region
                          : resource.region}
                      </TableCell>
                    </TableRow>
                  );
                })}
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
