import { Autocomplete } from '@linode/ui';
import { Grid } from '@mui/material';
import _ from 'lodash';
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { DebouncedSearchTextField } from 'src/components/DebouncedSearchTextField';
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

const serviceFilterOptions = [
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

interface AlertListingProps {
  alerts: Alert[];
}
export const AlertListing = (props: AlertListingProps) => {
  const { alerts } = props;
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

  // const { data: alerts, isError, isLoading } = useAlertDefinitionsQuery();

  const selectedAlert = alerts?.find((a) => a.id === selectedAlertId);

  const handleDelete = (alert: Alert) => {
    setSelectedAlertId(alert.id);
    setIsDeleteDialogOpen(true);
  };

  // eslint-disable-next-line no-console
  const fetchResults = () => console.log('API Called with this:', searchText);

  const debouncedFetchResults = _.debounce(fetchResults, 300);

  React.useEffect(() => {
    debouncedFetchResults();

    // Cancel debounce on cleanup
    return () => {
      debouncedFetchResults.cancel();
    };
  }, [debouncedFetchResults, searchText]);

  const onChange = (val: any[], operation: string) => {
    if (operation === 'selectOption') {
      if (
        serviceFilter.length === 1 &&
        serviceFilter[0].value === 'allServices'
      ) {
        const elms = val.filter(
          (elm: { value: string }) => elm.value !== 'allServices'
        );
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

  const onStatusFilterChange = (val: any, operation: string) => {
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
    history.push(
      `${location.pathname}/detail/${alert.service_type}/${alert.id}`
    );
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
            // eslint-disable-next-line no-console
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
            options={serviceFilterOptions}
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
              onStatusFilterChange(val, operation)
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
                active={orderBy === 'type'}
                colSpan={1}
                direction={order}
                handleClick={handleOrderChange}
                label="type"
              >
                Type
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
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {alerts?.map((alert) => (
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
