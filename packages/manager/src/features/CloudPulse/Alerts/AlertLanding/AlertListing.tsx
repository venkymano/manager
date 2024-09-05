import { Grid } from '@mui/material';
import _ from 'lodash';
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import { DebouncedSearchTextField } from 'src/components/DebouncedSearchTextField';
import { DocumentTitleSegment } from 'src/components/DocumentTitle';
import { Table } from 'src/components/Table';
import { TableBody } from 'src/components/TableBody';
import { TableCell } from 'src/components/TableCell';
import { TableHead } from 'src/components/TableHead';
import { TableRow } from 'src/components/TableRow';
import { TableSortCell } from 'src/components/TableSortCell';
import { useOrder } from 'src/hooks/useOrder';
import { usePagination } from 'src/hooks/usePagination';

import { AlertTableRow } from './AlertTableRow';
import { DeleteAlertDialogue } from './DeleteAlertDialogue';

import type { Alert } from '@linode/api-v4';

const useAlertsQuery = (pageInfo, filter) => {
  const data = [
    {
      createdBy: 'satkumar',
      id: 'someID',
      lastModified: 'jan 16, 2024, 4:10 PM',
      name: 'CPU Utilization - 20%',
      serviceType: 'Linode',
      severity: '1',
      status: 'Enabled',
    },
    {
      createdBy: 'satkumar',
      id: 'someID1',
      lastModified: 'jan 16, 2024, 4:10 PM',
      name: 'CPU Utilization - 30%',
      serviceType: 'Linode',
      severity: '1',
      status: 'Disabled',
    },
  ];

  return { data, error: {}, isLoading: false };
};

const serviceFileterOptions = [
  {
    label: 'All Services',
    value: 'allServices',
  },
  {
    label: 'Linodes',
    value: 'linodes',
  },
  {
    label: 'Volumes',
    value: 'volumes',
  },
  {
    label: 'NodeBalancers',
    value: 'nodeBalancers',
  },
];

const stausFilterOptions = [
  {
    label: 'All Status',
    value: 'AllStatus',
  },
  {
    label: 'Enabled',
    value: 'enabled',
  },
  {
    label: 'Disabled',
    value: 'disabled',
  },
];

const preferenceKey = 'alerts';

export const AlertListing = () => {
  const [searchText, setSearchText] = React.useState('');
  const [selectedAlertId, setSelectedAlertId] = React.useState<number>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const [serviceFilter, setServiceFilter] = React.useState<any>([
    {
      label: 'All Services',
      value: 'allServices',
    },
  ]);

  const [statusFilter, setStatusFilter] = React.useState<any>({
    label: 'All Status',
    value: 'AllStatus',
  });

  const history = useHistory();

  const location = useLocation<{ alert: Alert | undefined }>();

  const pagination = usePagination(1, preferenceKey);

  const { handleOrderChange, order, orderBy } = useOrder(
    {
      order: 'desc',
      orderBy: 'label',
    },
    `${preferenceKey}-order`
  );

  const filter = {
    ['+order']: order,
    ['+order_by']: orderBy,
  };

  const { data: alerts, error, isLoading } = useAlertsQuery(
    {
      page: pagination.page,
      page_size: pagination.pageSize,
    },
    filter
  );

  const selectedAlert = alerts?.find((a) => a.id === selectedAlertId);

  const handleDelete = (alert: Alert) => {
    setSelectedAlertId(alert.id);
    setIsDeleteDialogOpen(true);
  };

  const fetchResults = () => console.log('API Called with this:', searchText);

  const debouncedFetchResults = _.debounce(fetchResults, 300);

  React.useEffect(() => {
    debouncedFetchResults();

    // Cancel debounce on cleanup
    return () => {
      debouncedFetchResults.cancel();
    };
  }, [searchText]);

  const onChange = (val, operation: string) => {
    if (operation === 'selectOption') {
      if (
        serviceFilter.length === 1 &&
        serviceFilter[0].value === 'allServices'
      ) {
        const elms = val.filter((elm) => elm.value !== 'allServices');
        setServiceFilter(elms);
      } else if (val[val.length - 1].value === 'allServices') {
        setServiceFilter([
          {
            label: 'All Services',
            value: 'allServices',
          },
        ]);
      } else {
        setServiceFilter(val);
      }
    } else {
      if (serviceFilter.length === 1 || val.length == 0) {
        setServiceFilter([
          {
            label: 'All Services',
            value: 'allServices',
          },
        ]);
      } else {
        setServiceFilter(val);
      }
    }
  };

  const onStausFilterChange = (val, operation: string) => {
    if (operation === 'selectOption') {
      setStatusFilter(val);
    } else {
      setStatusFilter({
        label: 'All Status',
        value: 'AllStatus',
      });
    }
  };

  const handleDetails = (alert: Alert) => {
    history.push(`${location.pathname}/detail/${alert.id}`);
  };

  return (
    <>
      <Grid container spacing={1}>
        <Grid item marginTop={1} md={3} xs={12}>
          <DebouncedSearchTextField
            debounceTime={400}
            hideLabel
            isSearching={false}
            label="Search for something"
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={() => console.log('onSearch')}
            placeholder="Search for Alerts"
            value={searchText}
          />
        </Grid>
        <Grid item md={4} padding={0} xs={12}>
          <Autocomplete
            isOptionEqualToValue={(option, value) =>
              option.label === value.label
            }
            label=""
            multiple
            noMarginTop
            onChange={(_, val, operation) => onChange(val, operation)}
            options={serviceFileterOptions}
            placeholder=" "
            value={serviceFilter ?? []}
          />
        </Grid>
        <Grid item md={3} padding={0} xs={12}>
          <Autocomplete
            isOptionEqualToValue={(option, value) =>
              option.label === value.label
            }
            onChange={(_, val, operation) =>
              onStausFilterChange(val, operation)
            }
            label=""
            noMarginTop
            options={stausFilterOptions}
            value={statusFilter ?? []}
          />
        </Grid>
      </Grid>
      <Grid marginTop={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableSortCell
                active={orderBy === 'name'}
                colSpan={2}
                direction={order}
                handleClick={handleOrderChange}
                label="alertName"
              >
                Alert name
              </TableSortCell>
              <TableSortCell
                active={orderBy === 'serviceType'}
                colSpan={1}
                direction={order}
                handleClick={handleOrderChange}
                label="serviceType"
              >
                Service type
              </TableSortCell>
              <TableSortCell
                active={orderBy === 'severity'}
                colSpan={1}
                direction={order}
                handleClick={handleOrderChange}
                label="severity"
              >
                Severity
              </TableSortCell>
              <TableSortCell
                active={orderBy === 'status'}
                colSpan={1}
                direction={order}
                handleClick={handleOrderChange}
                label="status"
              >
                Status
              </TableSortCell>
              <TableSortCell
                active={orderBy === 'lastModified'}
                colSpan={1}
                direction={order}
                handleClick={handleOrderChange}
                label="lastModified"
              >
                Last modified
              </TableSortCell>
              <TableSortCell
                active={orderBy === 'size'}
                colSpan={1}
                direction={order}
                handleClick={handleOrderChange}
                label="size"
              >
                Created by
              </TableSortCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {alerts.map((alert) => (
              <AlertTableRow
                handlers={{
                  handleDelete: () => handleDelete(alert),
                  handleDetails: () => handleDetails(alert),
                }}
                alert={alert}
                key={alert.id}
              />
            ))}
          </TableBody>
        </Table>
      </Grid>
      <DeleteAlertDialogue
        alert={selectedAlert}
        onClose={() => setIsDeleteDialogOpen(false)}
        open={isDeleteDialogOpen}
      />
    </>
  );
};
