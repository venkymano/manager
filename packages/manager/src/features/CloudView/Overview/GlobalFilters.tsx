/* eslint-disable no-console */
import { Dashboard, TimeDuration } from '@linode/api-v4';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import * as React from 'react';

import { CircleProgress } from 'src/components/CircleProgress';
import { useFlags } from 'src/hooks/useFlags';
// import Reload from 'src/assets/icons/reload.svg';

import { Cached } from '@mui/icons-material';

import { Box } from 'src/components/Box';
import { ErrorState } from 'src/components/ErrorState/ErrorState';
import { Stack } from 'src/components/Stack';

import { GlobalFilterProperties } from '../Models/GlobalFilterProperties';
import { CloudViewDashboardSelect } from '../shared/DashboardSelect';
import { CloudPulseTimeRangeSelect } from '../shared/TimeRangeSelect';
import { FILTER_CONFIG } from '../Utils/FilterConfig';
import { CloudPulseDashboardFilterBuilder } from './DashboardFilterBuilder';

export const GlobalFilters = React.memo(
  (props: GlobalFilterProperties) => {
    const flags = useFlags(); // flags for rendering dynamic global filters

    const [selectedDashboard, setSelectedDashboard] = React.useState<
      Dashboard | undefined
    >();

    const handleDashboardChange = React.useCallback(
      (dashboard: Dashboard | undefined) => {
        if (dashboard && selectedDashboard?.id === dashboard.id) {
          return;
        }
        setSelectedDashboard(dashboard);

        props.handleDashboardChange(dashboard);
      },
      []
    );

    const handleGlobalRefresh = React.useCallback(() => {
      if (!selectedDashboard) {
        return;
      }
      props.handleAnyFilterChange('timestamp', Date.now());
    }, []);

    const filterChange = React.useCallback((filterKey: string, value: any) => {
      console.log(filterKey, value);
      props.handleAnyFilterChange(filterKey, value);
    }, []);

    const handleTimeRangeChange = (
      start: number,
      end: number,
      timeDuration?: TimeDuration,
      timeRangeLabel?: string
    ) => {
      filterChange('relative_time_duration', timeDuration);
    };

    if (!flags) {
      return (
        <CircleProgress /> // untill flags gets loaded, show circle progress
      );
    }

    const StyledReload = styled(Cached, { label: 'StyledReload' })(
      ({ theme }) => ({
        '&:active': {
          color: 'green',
        },
        '&:hover': {
          cursor: 'pointer',
        },
        // height: '30px',
        marginTop: 27,
        // width: '30px',
      })
    );

    const StyledGrid = styled(Grid, { label: 'StyledGrid' })(({ theme }) => ({
      alignItems: 'start',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'row',
      flexGrow: 1,
      gap: 5,
      justifyContent: 'start',
      marginBottom: theme.spacing(1.25),
    }));

    return (
      <Box sx={{ flexGrow: 1 }}>
        <Stack direction={'row'} flexGrow={1} justifyContent={'space-between'}>
          <Box key={'selectdashboard'} sx={{ marginLeft: 2, width: '100%' }}>
            <CloudViewDashboardSelect
              handleDashboardChange={handleDashboardChange}
            />
          </Box>
          <Stack
            alignContent={'end'}
            direction={'row'}
            gap={3}
            key={'selectduration'}
            width={'100%'}
          >
            <Box sx={{ marginLeft: '50%', width: '50%' }}>
              <CloudPulseTimeRangeSelect
                disabled={!selectedDashboard}
                handleStatsChange={handleTimeRangeChange}
                savePreferences={true}
              />
            </Box>
            <StyledReload
              aria-disabled={!selectedDashboard}
              onClick={handleGlobalRefresh}
            />
          </Stack>
        </Stack>
        <StyledGrid container xs={12}>
          <Box style={{ width: '100%' }}></Box>
          {selectedDashboard &&
            FILTER_CONFIG.get(selectedDashboard.service_type) && (
              <CloudPulseDashboardFilterBuilder
                dashboard={selectedDashboard}
                emitFilterChange={filterChange}
                serviceAnalyticsIntegration={false}
              />
            )}

          {selectedDashboard &&
            !FILTER_CONFIG.get(selectedDashboard.service_type) && <></>}
        </StyledGrid>
      </Box>
    );
  },
  (old, newProps) => true
);
