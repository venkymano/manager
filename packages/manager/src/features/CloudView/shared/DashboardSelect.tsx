/* eslint-disable no-console */
import {
  APIError,
  Dashboard,
  ResourcePage,
  ServiceTypesList,
} from '@linode/api-v4';
import { UseQueryResult } from '@tanstack/react-query';
import * as React from 'react';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import { Box } from 'src/components/Box';
import Select from 'src/components/EnhancedSelect/Select';
import { TextField } from 'src/components/TextField';
import { Typography } from 'src/components/Typography';
import { useCloudViewDashboardsQuery } from 'src/queries/cloudview/dashboards';
import { useCloudViewServices } from 'src/queries/cloudview/services';

import {
  DASHBOARD_ID,
  REGION,
  RESOURCES,
  WIDGETS,
} from '../Utils/CloudPulseConstants';
import {
  fetchUserPrefObject,
  updateGlobalFilterPreference,
} from '../Utils/UserPreference';
export interface CloudViewDashbboardSelectProps {
  handleDashboardChange: (dashboard: Dashboard | undefined) => void;
}

export const CloudViewDashboardSelect = React.memo(
  (props: CloudViewDashbboardSelectProps) => {
    let errorDashboardTypes: string = '';
    let dashboardsLoading: boolean = false;

    // extracts a list of service types from query
    const formattedServiceTypes = (
      rawServiceTypes: ServiceTypesList | undefined
    ) => {
      if (rawServiceTypes == undefined || rawServiceTypes.data.length == 0) {
        return [];
      }
      return rawServiceTypes.data.map((obj) => obj.service_type);
    };

    // extracts a list of all dashboards from queries and sets loading and error states
    const getAllDashboards = (
      queryResults: UseQueryResult<ResourcePage<Dashboard>, APIError[]>[]
    ) => {
      return queryResults
        .filter((queryResult, index) => {
          if (queryResult.isError) {
            errorDashboardTypes +=
              formattedServiceTypes(serviceTypesList)[index] + ' ,';
          }
          if (queryResult.isLoading) {
            dashboardsLoading = true;
          }
          return !queryResult.isLoading && !queryResult.isError;
        })
        .map((queryResult) => queryResult?.data?.data)
        .flat();
    };

    const getErrorText = () => {
      if (serviceTypesError) {
        return 'Unable to load service types';
      }
    };

    const {
      data: serviceTypesList,
      error: serviceTypesError,
      isLoading: serviceTypesLoading,
    } = useCloudViewServices();

    const dashboardsList = getAllDashboards(
      useCloudViewDashboardsQuery(formattedServiceTypes(serviceTypesList))
    );

    // sorts dashboards by service type. Required due to unexpected autocomplete grouping behaviour
    const getSortedDashboardsList = (options: any[]) => {
      return options.sort(
        (a, b) => -b.service_type.localeCompare(a.service_type)
      );
    };

    const getPrefferedBoard = () => {
      const defaultValue = fetchUserPrefObject()?.dashboardId;
      if (defaultValue) {
        const match = dashboardsList.find((obj) => obj?.id == defaultValue);
        props.handleDashboardChange(match);
        return match;
      }

      props.handleDashboardChange(undefined);
      return undefined;
    };

    if (!dashboardsList || dashboardsList.length == 0) {
      return (
        <Select
          disabled={true}
          isClearable={true}
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          onChange={() => {}}
          placeholder="Select Dashboard"
        />
      );
    }

    return (
      <Autocomplete
        errorText={
          serviceTypesError
            ? 'Unable to load service types'
            : errorDashboardTypes.length > 0
            ? 'Unable to load ' +
              errorDashboardTypes?.slice(0, -1) +
              ' dashboards'
            : ''
        }
        onChange={(_: any, dashboard: Dashboard) => {
          updateGlobalFilterPreference({
            [DASHBOARD_ID]: dashboard?.id,
            [REGION]: null,
            [RESOURCES]: [],
            [WIDGETS]: {},
          });
          props.handleDashboardChange(dashboard);
        }}
        options={
          !dashboardsList || dashboardsList.length == 0
            ? []
            : getSortedDashboardsList(dashboardsList)
        }
        renderGroup={(params) => (
          <Box key={params.key}>
            <Typography
              sx={{ marginLeft: '3.5%', textTransform: 'capitalize' }}
              variant="h3"
            >
              {params.group}
            </Typography>
            {params.children}
          </Box>
        )}
        autoHighlight
        clearOnBlur
        data-testid="cloudview-dashboard-select"
        defaultValue={getPrefferedBoard()}
        fullWidth
        groupBy={(option: Dashboard) => option.service_type}
        isOptionEqualToValue={(option, value) => option.label === value.label}
        label=""
        loading={dashboardsLoading || serviceTypesLoading}        
        placeholder="Select Dashboard"
      />
    );
  }
);
