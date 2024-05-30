import { Dashboard } from '@linode/api-v4';
import { Paper } from '@mui/material';
import * as React from 'react';

import { CircleProgress } from 'src/components/CircleProgress';
import { useMutatePreferences, usePreferences } from 'src/queries/preferences';

import { AclpConfig, AclpWidget } from '../Models/CloudPulsePreferences';
import { FiltersObject } from '../Models/GlobalFilterProperties';
import { GlobalFilters } from '../Overview/GlobalFilters';
import { CloudPulseDashboard, DashboardProperties } from './Dashboard';

export const DashBoardLanding = () => {
  const generateStartTime = (modifier: string, nowInSeconds: number) => {
    switch (modifier) {
      case 'Past 30 Minutes':
        return nowInSeconds - 30 * 60;
      case 'Past 12 Hours':
        return nowInSeconds - 12 * 60 * 60;
      case 'Past 24 Hours':
        return nowInSeconds - 24 * 60 * 60;
      case 'Past 7 Days':
        return nowInSeconds - 7 * 24 * 60 * 60;
      default:
        return nowInSeconds - 30 * 24 * 60 * 60;
    }
  };

  const getInitDashboardProps = () => {
    const props = {} as DashboardProperties;
    props.dashboardFilters = {} as FiltersObject;

    props.dashboardFilters.interval = '1minute';
    props.dashboardFilters.step = { unit: 'min', value: 1 };

    props.dashboardFilters.region = undefined!;
    props.dashboardFilters.resource = [];
    props.dashboardFilters.serviceType = undefined;
    props.dashboardFilters.duration = { unit: 'min', value: 30 };
    props.dashboardFilters.timeRange = {
      end: Date.now() / 1000,
      start: generateStartTime('Past 30 Minutes', Date.now() / 1000),
    };

    return props;
  };

  const [dashboardProp, setDashboardProp] = React.useState<DashboardProperties>(
    getInitDashboardProps()
  );

  // since dashboard prop is mutable and savable
  const dashboardPropRef = React.useRef<DashboardProperties>(
    getInitDashboardProps()
  );

  // since preference is mutable and savable
  const preferenceRef = React.useRef<any>();

  const { data: preferences, refetch: refetchPreferences } = usePreferences();
  const { mutateAsync: updatePreferences } = useMutatePreferences();

  const updatedDashboard = React.useRef<Dashboard>();

  const handlPrefChange = (item: AclpConfig) => {
    refetchPreferences()
      .then(({ data: response }) => response ?? Promise.reject())
      .then((response) => {
        updatePreferences({
          ...response,
          aclpPreference: item,
        });
      })
      .catch(); // swallow the error, it's nbd if the choice isn't saved
  };

  const handleGlobalFilterChange = (
    globalFilter: FiltersObject,
    changedFilter: string
  ) => {
    if (!dashboardPropRef || !dashboardPropRef.current) {
      dashboardPropRef.current = getInitDashboardProps();
    }

    if (changedFilter === 'timeduration') {
      dashboardPropRef.current.dashboardFilters.duration =
        globalFilter.duration;
      dashboardPropRef.current.dashboardFilters.timeRange =
        globalFilter.timeRange;
      preferenceRef.current.aclpPreference.timeDuration =
        globalFilter.durationLabel;
    }

    if (
      changedFilter === 'region' &&
      dashboardPropRef.current.dashboardFilters.region != globalFilter.region
    ) {
      dashboardPropRef.current.dashboardFilters.region = globalFilter.region;
      preferenceRef.current.aclpPreference.region = globalFilter.region;
      if (
        preferences &&
        preferences.aclpPreference.region !=
          preferenceRef.current.aclpPreference.region
      ) {
        preferenceRef.current.aclpPreference.resources = [];
        dashboardPropRef.current.dashboardFilters.resource = [];
      }
    }

    if (changedFilter === 'resource') {
      dashboardPropRef.current.dashboardFilters.resource =
        globalFilter.resource;
      preferenceRef.current.aclpPreference.dashboardId = dashboardPropRef
        .current.dashboardId
        ? dashboardPropRef.current.dashboardId
        : undefined!;
      preferenceRef.current.aclpPreference.region =
        dashboardPropRef.current.dashboardFilters.region;
      preferenceRef.current.aclpPreference.resources = globalFilter.resource;
    }

    if (changedFilter === 'timestep') {
      dashboardPropRef.current.dashboardFilters.interval =
        globalFilter.interval;
      dashboardPropRef.current.dashboardFilters.step = globalFilter.step;
      preferenceRef.current.aclpPreference.interval = globalFilter.interval;
    }

    if (changedFilter === 'refresh') {
      dashboardPropRef.current.dashboardFilters.timestamp =
        globalFilter.timestamp;
    }
    // set as dashboard filter
    setDashboardProp({
      ...dashboardProp,
      dashboardFilters: { ...dashboardPropRef.current.dashboardFilters },
      dashboardId: updatedDashboard.current
        ? updatedDashboard.current.id
        : undefined!,
    });

    handlPrefChange(preferenceRef.current.aclpPreference);
  };

  const handleDashboardChange = (dashboard: Dashboard) => {
    if (!dashboard) {
      dashboardPropRef.current.dashboardId = undefined!;
      dashboardPropRef.current.dashboardFilters.serviceType = undefined!;
      updatedDashboard.current = undefined!;
      setDashboardProp({ ...dashboardPropRef.current });

      preferenceRef.current.aclpPreference.dashboardId = undefined!;
      preferenceRef.current.aclpPreference.resources = [];
      preferenceRef.current.aclpPreference.region = '';

      handlPrefChange(preferenceRef.current.aclpPreference);
      return;
    }

    if (!dashboardPropRef || !dashboardPropRef.current) {
      dashboardPropRef.current = getInitDashboardProps();
    }

    // update prefs if any
    if (preferences && preferences.aclpPreference.widgets) {
      for (let i = 0; i < dashboard.widgets.length; i++) {
        for (let j = 0; j < preferences.aclpPreference.widgets.length; j++) {
          if (
            preferences.aclpPreference.widgets[j].label ==
            dashboard.widgets[i].label
          ) {
            dashboard.widgets[i].size =
              preferences.aclpPreference.widgets[j].size ??
              dashboard.widgets[i].size;
            dashboard.widgets[i].aggregate_function =
              preferences.aclpPreference.widgets[j].aggregateFunction ??
              dashboard.widgets[i].aggregate_function;
            dashboard.widgets[i].time_granularity = preferences.aclpPreference
              .widgets[j].time_granularity ?? {
              ...dashboard.widgets[i].time_granularity,
            };
            break;
          }
        }
      }
    }
    dashboardPropRef.current.dashboardId = dashboard.id;
    dashboardPropRef.current.dashboardFilters.serviceType =
      dashboard.service_type;

    setDashboardProp({ ...dashboardPropRef.current });
    updatedDashboard.current = { ...dashboard };

    if (dashboard && dashboard.id) {
      preferenceRef.current.aclpPreference.dashboardId = dashboard.id;

      if (
        preferences &&
        preferences.aclpPreference.dashboardId !=
          preferenceRef.current.aclpPreference.dashboardId
      ) {
        preferenceRef.current.aclpPreference.resources = [];
        dashboardPropRef.current.dashboardFilters.resource = [];
      }
    }

    handlPrefChange(preferenceRef.current.aclpPreference);
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

  const dashboardChange = (dashboardObj: Dashboard) => {
    // todo, whenever a change in dashboard happens
    updatedDashboard.current = { ...dashboardObj };

    if (dashboardObj.widgets) {
      preferenceRef.current.aclpPreference.widgets = dashboardObj.widgets.map(
        (obj) => {
          return {
            aggregateFunction: obj.aggregate_function,
            label: obj.label,
            size: obj.size,
            time_granularity: { ...obj.time_granularity },
          };
        }
      );
      // call preferences
      handlPrefChange(preferenceRef.current.aclpPreference);
    }
  };

  if (!preferences) {
    return <CircleProgress></CircleProgress>;
  } else {
    if (!preferenceRef || !preferenceRef.current) {
      preferenceRef.current = { ...preferences };

      if (!preferenceRef.current.aclpPreference) {
        preferenceRef.current.aclpPreference = {} as AclpConfig;
      } else {
        preferenceRef.current.aclpPreference = {
          ...preferences.aclpPreference,
        };
      }
    }
  }
  return (
    <>
      <Paper style={{ borderStyle: 'ridge' }}>
        <div style={{ display: 'flex' }}>
          <div style={{ width: '100%' }}>
            <GlobalFilters
              globalFilters={
                dashboardProp.dashboardFilters
                  ? dashboardProp.dashboardFilters
                  : ({} as FiltersObject)
              }
              handleAnyFilterChange={(
                filters: FiltersObject,
                changedFilter: string
              ) => handleGlobalFilterChange(filters, changedFilter)}
              handleDashboardChange={(dashboardObj: Dashboard) =>
                handleDashboardChange(dashboardObj)
              }
              filterPreferences={preferences.aclpPreference}
            ></GlobalFilters>
          </div>
        </div>
      </Paper>
      {dashboardProp.dashboardFilters.serviceType &&
        dashboardProp.dashboardFilters.region &&
        dashboardProp.dashboardFilters.resource &&
        dashboardProp.dashboardFilters.resource.length > 0 &&
        dashboardProp.dashboardFilters.timeRange &&
        dashboardProp.dashboardFilters.step && (
          <CloudPulseDashboard
            {...dashboardProp}
            onDashboardChange={dashboardChange}
            widgetPreferences={preferenceRef.current.aclpPreference.widgets}
          />
        )}
    </>
  );
};
