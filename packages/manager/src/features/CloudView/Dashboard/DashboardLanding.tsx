import { Dashboard, TimeDuration } from '@linode/api-v4';
import { Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import * as React from 'react';

import CloudPulseIcon from 'src/assets/icons/entityIcons/Monitor.svg';
import { CircleProgress } from 'src/components/CircleProgress';
import { Placeholder } from 'src/components/Placeholder/Placeholder';

import { GlobalFilters } from '../Overview/GlobalFilters';
import {
  REFRESH,
  REGION,
  RESOURCES,
  TIME_DURATION,
} from '../Utils/CloudPulseConstants';
import { useIsRegionApplicable } from '../Utils/CloudPulseUtils';
import { getUserPreference } from '../Utils/UserPreference';
import { CloudPulseDashboard } from './Dashboard';

const StyledPlaceholder = styled(Placeholder, {
  label: 'StyledPlaceholder',
})({
  flex: 'auto',
});

export const DashBoardLanding = () => {
  // const [dashboardFilters, setDashboardFilters] = React.useState<FiltersObject>({} as FiltersObject);
  // const dashboardRef = React.useRef({});
  const [timeDuration, setTimeDuration] = React.useState<TimeDuration>();
  const [region, setRegion] = React.useState<string>();
  const [resources, setResources] = React.useState<string[]>();
  const [timeStamp, setTimeStamp] = React.useState<number>();
  // const [serviceType, setServiceType] = React.useState<string>();
  const [dashboard, setDashboard] = React.useState<Dashboard>();
  const [isPrefLoaded, setIsPrefLoaded] = React.useState<boolean>(false);

  const isRegionAppl: boolean = useIsRegionApplicable(dashboard?.service_type);

  const handleGlobalFilterChange = React.useCallback(
    (updatedData: any, changedFilter: string) => {
      switch (changedFilter) {
        case REGION: {
          setRegion(updatedData);
          break;
        }
        case RESOURCES: {
          setResources(updatedData);
          break;
        }
        case TIME_DURATION: {
          setTimeDuration(updatedData);
          break;
        }
        case REFRESH: {
          setTimeStamp(updatedData);
          break;
        }
      }
    },
    []
  );
  const handleDashboardChange = React.useCallback((dashboard: Dashboard) => {
    setDashboard(dashboard);
  }, []);

  const saveOrEditDashboard = (dashboard: Dashboard) => {
    // todo, implement save option
  };

  const deleteDashboard = (dashboardId: number) => {
    // todo, implement delete option
  };

  const markDashboardAsFavorite = () => {
    // todo, implement mark dashboard as favorite
  };

  const resetView = () => {
    // todo, implement the reset view function
  };

  const dashboardChange = React.useCallback((dashboardObj: Dashboard) => {
    setDashboard(dashboardObj);
  }, []);

  // Fetch the data from preferences
  React.useEffect(() => {
    const fetchPreferences = async () => {
      const userPreference = await getUserPreference();
      setIsPrefLoaded(true);
    };
    fetchPreferences();
  }, []);

  if (!isPrefLoaded) {
    return <CircleProgress></CircleProgress>;
  }

  return (
    <>
      <Paper style={{ border: 'solid 1px #e3e5e8' }}>
        <div style={{ display: 'flex' }}>
          <div style={{ width: '100%' }}>
            <GlobalFilters
              handleAnyFilterChange={handleGlobalFilterChange}
              handleDashboardChange={handleDashboardChange}
            ></GlobalFilters>
          </div>
        </div>
      </Paper>
      {dashboard &&
        (!isRegionAppl || region) &&
        resources &&
        resources.length > 0 &&
        timeDuration && (
          <CloudPulseDashboard
            dashboardId={dashboard.id}
            duration={timeDuration}
            manualRefreshTimeStamp={timeStamp}
            onDashboardChange={dashboardChange}
            region={region}
            resources={resources}
            // widgetPreferences={fetchUserPrefObject().widgets}
            savePref={true}
          />
        )}

      {(!dashboard ||
        (!region && isRegionAppl) ||
        !resources ||
        resources.length == 0 ||
        !timeDuration) && (
        <Paper>
          <StyledPlaceholder
            icon={CloudPulseIcon}
            isEntity
            subtitle="Select Dashboard and filters to visualize metrics"
            title=""
          />
        </Paper>
      )}
    </>
  );
};
