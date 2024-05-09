import { Dashboard } from '@linode/api-v4';
import { Paper } from '@mui/material';
import * as React from 'react';

import { FiltersObject } from '../Models/GlobalFilterProperties';
import {
  AclpConfig,
  AclpPreference,
  AclpWidgetPreferences,
} from '../Models/UserPreferences';
import { GlobalFilters } from '../Overview/GlobalFilters';
import { CloudPulseDashboard, DashboardProperties } from './Dashboard';

export const DashBoardLanding = () => {
  const [dashboardProp, setDashboardProp] = React.useState<DashboardProperties>(
    {} as DashboardProperties
  );

  const [aclpPreference, setAclpPreference] = React.useState<AclpPreference>();

  const updatedDashboard = React.useRef<Dashboard>();

  React.useEffect(() => {
    // localStorage.setItem('aclp_config', JSON.stringify(aclpPreference));
    // Todo, make an API call
  }, [aclpPreference]);

  const handleGlobalFilterChange = (globalFilter: FiltersObject) => {
    // set as dashboard filter
    setDashboardProp({
      ...dashboardProp,
      dashbaord: updatedDashboard.current!,
      dashboardFilters: globalFilter,
    });

    // set updated preferences
    setAclpPreference(constructDashboardPreference(globalFilter));
  };

  const handleDashboardChange = (dashboard: Dashboard) => {
    setDashboardProp({ ...dashboardProp, dashbaord: dashboard });
    updatedDashboard.current = { ...dashboard };

    let aclpPreferencObj: AclpPreference = {} as AclpPreference;

    if (aclpPreference) {
      aclpPreferencObj = { ...aclpPreference };
    }
    // copy initial set of properties
    if (dashboard) {
      aclpPreferencObj.aclp_config.dashboard_id = dashboard.id;

      const widgets: AclpWidgetPreferences[] = [];

      const currentWidgets = updatedDashboard.current?.widgets;

      if (currentWidgets) {
        currentWidgets.forEach((widget) => {
          widgets.push({ label: widget.label, size: widget.size });
        });
      }

      aclpPreferencObj.aclp_config.widgets = [...widgets];

      setAclpPreference({ ...aclpPreferencObj });
    }
  };

  const constructDashboardPreference = (globalFilter: FiltersObject) => {
    let aclpPreferencObj: AclpPreference = {} as AclpPreference;
    let aclpConfig: AclpConfig = {} as AclpConfig;

    // copy initial set of properties
    if (aclpPreference) {
      aclpPreferencObj = { ...aclpPreference };
      aclpConfig = { ...aclpPreference.aclp_config };
    }

    aclpConfig.aggregation_interval = globalFilter.interval;
    aclpConfig.time_duration = globalFilter.timeRangeLabel; // todo, check this
    aclpConfig.region = globalFilter.region;
    aclpConfig.resources = globalFilter.resource;
    aclpPreferencObj.aclp_config = aclpConfig;

    return aclpPreferencObj;
  };

  const constructWidgetsPreference = (dashboardObj: Dashboard) => {
    const currentWidgets = dashboardObj?.widgets;
    const widgets: AclpWidgetPreferences[] = [];

    if (currentWidgets) {
      currentWidgets.forEach((widget) => {
        widgets.push({ label: widget.label, size: widget.size });
      });
    }

    return widgets;
  };

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

  const dashbaordChange = (dashboardObj: Dashboard) => {
    // todo, whenever a change in dashboard happens
    updatedDashboard.current = { ...dashboardObj };

    if (aclpPreference) {
      aclpPreference!.aclp_config.widgets = [
        ...constructWidgetsPreference({ ...dashboardObj }),
      ];
      setAclpPreference(aclpPreference);
    } else {
      const newPreference =
        localStorage.getItem('aclp_config') != null &&
        localStorage.getItem('aclp_config')
          ? JSON.parse(localStorage.getItem('aclp_config')!)
          : ({} as AclpPreference);
      newPreference.aclp_config.widgets = constructWidgetsPreference({
        ...dashboardObj,
      });
      setAclpPreference(newPreference);
    }
  };

  return (
    <>
      <Paper>
        <div style={{ display: 'flex' }}>
          <div style={{ width: '100%' }}>
            <GlobalFilters
              handleAnyFilterChange={(filters: FiltersObject) =>
                handleGlobalFilterChange(filters)
              }
              handleDashboardChange={(dashboardObj: Dashboard) =>
                handleDashboardChange(dashboardObj)
              }
              aclpPreferences={aclpPreference ? aclpPreference : undefined}
            ></GlobalFilters>
          </div>
        </div>
      </Paper>
      <CloudPulseDashboard
        {...dashboardProp}
        onDashboardChange={dashbaordChange}
      />
    </>
  );
};
