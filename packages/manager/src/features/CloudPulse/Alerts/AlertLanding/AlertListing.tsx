import { Grid } from "@mui/material";
import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Autocomplete } from "src/components/Autocomplete/Autocomplete";
import { DebouncedSearchTextField } from "src/components/DebouncedSearchTextField";
import { DocumentTitleSegment } from "src/components/DocumentTitle";
import { Table } from "src/components/Table";
import { TableCell } from "src/components/TableCell";
import { TableHead } from 'src/components/TableHead';
import { TableRow } from 'src/components/TableRow';
import { TableBody } from 'src/components/TableBody';
import { TableSortCell } from "src/components/TableSortCell";
import { useOrder } from "src/hooks/useOrder";
import { usePagination } from "src/hooks/usePagination";
import { AlertTableRow } from "./AlertTableRow";
import _ from 'lodash';

const useAlertsQuery =  (pageInfo, filter) => {
  const data = [
    {
      id: "someID",
      alertName: "CPU Utilization - 20%",
      serviceType: "Linode",
      severity: "1",
      status: "Enabled",
      lastModified: "jan 16, 2024, 4:10 PM",
      createdBy: "satkumar",
    },
    {
      id: "someID1",
      alertName: "CPU Utilization - 30%",
      serviceType: "Linode",
      severity: "1",
      status: "Disabled",
      lastModified: "jan 16, 2024, 4:10 PM",
      createdBy: "satkumar",
    },
  ];

  return {data: data, error: {}, isLoading: false};
}


const serviceFileterOptions = [
  {
    label: "All Services",
    value: "allServices"
  },
  {
    label: "Linodes",
    value: "linodes"
  },
  {
    label: "Volumes",
    value: "volumes"
  },
  {
    label: "NodeBalancers",
    value: "nodeBalancers"
  },
];

const stausFilterOptions= [
  {
    label: "All Status",
    value: "AllStatus"
  },
  {
    label: "Enabled",
    value: "enabled"
  },
  {
    label: "Disabled",
    value: "disabled"
  },
]

const preferenceKey = 'alerts';

export const AlertListing = () => {

  const [searchText, setSearchText] = React.useState("");
  const [serviceFilter , setServiceFilter] = React.useState<any>([{
    label: "All Services",
    value: "allServices"
  }]);

  const [statusFilter , setStatusFilter] = React.useState<any>([{
    label: "All Status",
    value: "AllStatus"
  }]);

  const history = useHistory();

  const location = useLocation<{ alert: any | undefined }>();

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

  const { data : alerts, error, isLoading } = useAlertsQuery(
    {
      page: pagination.page,
      page_size: pagination.pageSize,
    },
    filter
  );

  const fetchResults = (() => console.log("API Called with this:", searchText));

  const debouncedFetchResults = _.debounce(fetchResults, 300);

  React.useEffect(() => {
    debouncedFetchResults();

    // Cancel debounce on cleanup
    return () => {
      debouncedFetchResults.cancel();
    };
  }, [searchText]);

  const onChange = (val, operation) => {
      if(operation === "selectOption") {
        if(serviceFilter.length === 1 && serviceFilter[0].value === "allServices"){
          const elms = val.filter((elm) => elm.value!=="allServices");
          setServiceFilter(elms);
        }
        else if(val[val.length -1].value === "allServices") {
          setServiceFilter([{
            label: "All Services",
            value: "allServices"
          }]);
        }
        else setServiceFilter(val);
      }
      else {
        if(serviceFilter.length === 1 || val.length == 0) {
          setServiceFilter([{
            label: "All Services",
            value: "allServices"
          }]);
        }
        else setServiceFilter(val);
        
      }
  }
  
  const handleDetails = (alert) => {
    history.push(`${location.pathname}/detail/${alert.id}`);
  }
 
  return <>
    <Grid md={12} container spacing={1}>
      <Grid item md={3} xs={12} marginTop={1}>
        <DebouncedSearchTextField
          debounceTime={400}
          hideLabel
          isSearching={false}
          label="Search for something"
          onSearch={() => console.log('onSearch')}
          placeholder="Search for Alerts"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </Grid>
      <Grid item md={4} xs={12} padding={0}>
        <Autocomplete
          label=""
          options={serviceFileterOptions}
          noMarginTop
          multiple
          placeholder=" "
          //onChange={(_,val, operation) => setServiceFilter(val)}
          onChange={(_,val, operation) => onChange(val,operation)}
          isOptionEqualToValue={(option, value) => option.label === value.label}
          value={(serviceFilter) ? serviceFilter : []}
          
          />
      </Grid>
      <Grid item md={3} xs={12} padding={0}>
        <Autocomplete
        label=""
        options={stausFilterOptions}
        noMarginTop 
        // onChange={(_,val, operation) => onStausFilterChange(val,operation)}
        //   isOptionEqualToValue={(option, value) => option.label === value.label}
        //   value={(statusFilter) ? statusFilter : []}
        />
      </Grid>
    </Grid>
    <Grid marginTop={2} >
      <Table>
        <TableHead>
          <TableRow>
            <TableSortCell
              active={orderBy === 'alertName'}
              direction={order}
              handleClick={handleOrderChange}
              label="alertName"
              colSpan={2}
            >
              Alert name
            </TableSortCell>
            <TableSortCell
              active={orderBy === 'serviceType'}
              direction={order}
              handleClick={handleOrderChange}
              label="serviceType"
              colSpan={1}
            >
              Service type
            </TableSortCell>
            <TableSortCell
              active={orderBy === 'severity'}
              direction={order}
              handleClick={handleOrderChange}
              label="severity"
              colSpan={1}
            >
              Severity
            </TableSortCell>
            <TableSortCell
              active={orderBy === 'status'}
              direction={order}
              handleClick={handleOrderChange}
              label="status"
              colSpan={1}
            >
              Status
            </TableSortCell>
            <TableSortCell
              active={orderBy === 'lastModified'}
              direction={order}
              handleClick={handleOrderChange}
              label="lastModified"
              colSpan={1}
            >
              Last modified
            </TableSortCell>
            <TableSortCell
              active={orderBy === 'size'}
              direction={order}
              handleClick={handleOrderChange}
              label="size"
              colSpan={1}
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
                  handleDetails: () => handleDetails(alert),
                  
                }}
                key={alert.id}
                alert ={alert}
              />
            ))}
          </TableBody>
      </Table>
    </Grid>
  </>
}