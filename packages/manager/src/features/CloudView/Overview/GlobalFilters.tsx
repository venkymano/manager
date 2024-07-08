/* eslint-disable no-console */
import { Dashboard } from '@linode/api-v4';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import * as React from 'react';

import { CircleProgress } from 'src/components/CircleProgress';
import { useFlags } from 'src/hooks/useFlags';
// import Reload from 'src/assets/icons/reload.svg';

import { Cached } from '@mui/icons-material';

import { GlobalFilterProperties } from '../Models/GlobalFilterProperties';
import { CloudPulseDashboardFilterBuilder } from '../Reusable/DashboardFilterBuilder';
import { CloudViewDashboardSelect } from '../shared/DashboardSelect';

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
      props.handleAnyFilterChange('timestamp', Date.now());
    }, []);

    const filterChange = React.useCallback((filterKey: string, value: any) => {
      console.log(filterKey, value);
      props.handleAnyFilterChange(filterKey, value);
    }, []);

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
        height: '30px',
        marginTop: 27,
        width: '30px',
      })
    );

    const StyledGrid = styled(Grid, { label: 'StyledGrid' })(({ theme }) => ({
      alignItems: 'end',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'row',
      gap: 5,
      justifyContent: 'start',
      // flexWrap:'nowrap',
      marginBottom: theme.spacing(1.25),
    }));

    return (
      <StyledGrid container xs={12}>
        <Grid sx={{ marginLeft: 2, width: 300 }}>
          <CloudViewDashboardSelect
            handleDashboardChange={handleDashboardChange}
          />
        </Grid>
        {selectedDashboard && (
          <CloudPulseDashboardFilterBuilder
            dashboardId={selectedDashboard.id}
            emitFilterChange={filterChange}
          />
        )}

        {selectedDashboard && (
          <Grid sx={{ marginLeft: 1, marginRight: 3 }}>
            <StyledReload onClick={handleGlobalRefresh} />
          </Grid>
        )}
      </StyledGrid>
    );
  },
  (old, newProps) => true
);
