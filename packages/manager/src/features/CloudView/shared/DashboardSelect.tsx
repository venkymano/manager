/* eslint-disable no-console */
import { Dashboard } from '@linode/api-v4';
import * as React from 'react';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import { Box } from 'src/components/Box';
import Select from 'src/components/EnhancedSelect/Select';
import { Typography } from 'src/components/Typography';
import { useCloudViewDashboardsQuery } from 'src/queries/cloudview/dashboards';
import { usePreferences } from 'src/queries/preferences';

import Event from '../Dashboard/ListenerUtils';

export interface CloudViewDashbboardSelectProps {
  defaultValue?: number;
  handleDashboardChange: (
    dashboard: Dashboard | undefined,
    isClear: boolean
  ) => void;
}

export const CloudViewDashboardSelect = React.memo(
  (props: CloudViewDashbboardSelectProps) => {
    const {
      data: dashboardsList,
      error,
      isLoading,
    } = useCloudViewDashboardsQuery();

    const {
      data: { ...preferences },
      refetch: refetchPreferences,
    } = usePreferences();

    const [defaultSet, setDefaultSet] = React.useState<boolean>(
      false
    );

    const errorText: string = error ? 'Error loading dashboards' : '';

    const [selectedDashboard, setDashboard] = React.useState<
      Dashboard | undefined
    >();

    React.useEffect(() => {

      if(defaultSet) {
        Event.emit('dashboardChange', selectedDashboard?.id);
      }      
      props.handleDashboardChange(selectedDashboard, !defaultSet);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDashboard]);

    // sorts dashboards by service type. Required due to unexpected autocomplete grouping behaviour
    const getSortedDashboardsList = (options: Dashboard[]) => {
      return options.sort(
        (a, b) => -b.service_type.localeCompare(a.service_type)
      );
    };

    const getPrefferedBoard = () => {
      if (
        !selectedDashboard &&
        dashboardsList?.data &&
        preferences &&
        preferences.aclpPreference &&
        preferences.aclpPreference.dashboardId &&
        !defaultSet
      ) {
        const match = dashboardsList?.data.find(
          (obj) => obj.id == preferences.aclpPreference.dashboardId
        );
        setDashboard(match);
        setDefaultSet(true);
        return match;
      }

      return selectedDashboard;
    };

    if (!dashboardsList || !preferences) {
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
        onChange={(_: any, dashboard: Dashboard) => {
          setDashboard(dashboard);
          //   props.handleDashboardChange(dashboard);
        }}
        options={
          !dashboardsList ? [] : getSortedDashboardsList(dashboardsList.data)
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
        // defaultValue={selectedDashboard}

        clearOnBlur
        data-testid="cloudview-dashboard-select"
        defaultValue={getPrefferedBoard()}
        errorText={errorText}
        fullWidth
        groupBy={(option: Dashboard) => option.service_type}
        isOptionEqualToValue={(option, value) => option.label === value.label}
        label=""
        loading={isLoading}
        noMarginTop
        placeholder="Select a Dashboard"
      />
    );
  }
);
