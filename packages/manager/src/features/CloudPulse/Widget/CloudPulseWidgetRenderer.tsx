import { Grid, Paper } from '@mui/material';
import deepEqual from 'fast-deep-equal';
import React from 'react';

import CloudPulseIcon from 'src/assets/icons/entityIcons/monitor.svg';
import { Placeholder } from 'src/components/Placeholder/Placeholder';

import { createObjectCopy } from '../Utils/utils';
import { CloudPulseWidget } from './CloudPulseWidget';
import {
  allIntervalOptions,
  getInSeconds,
  getIntervalIndex,
} from './components/CloudPulseIntervalSelect';

import type { CloudPulseResources } from '../shared/CloudPulseResourcesSelect';
import type {
  CloudPulseMetricsAdditionalFilters,
  CloudPulseWidgetProperties,
} from './CloudPulseWidget';
import type {
  AclpConfig,
  AvailableMetrics,
  Dashboard,
  JWEToken,
  TimeDuration,
  Widgets,
} from '@linode/api-v4';

interface WidgetProps {
  additionalFilters?: CloudPulseMetricsAdditionalFilters[];
  dashboard?: Dashboard | undefined;
  duration: TimeDuration;
  jweToken?: JWEToken | undefined;
  manualRefreshTimeStamp?: number;
  metricDefinitions: any;
  preferences?: AclpConfig;
  resourceList: CloudPulseResources[] | undefined;
  resources: string[];
  savePref?: boolean;
}

const renderPlaceHolder = (subtitle: string) => {
  return (
    <Grid item xs>
      <Paper>
        <Placeholder icon={CloudPulseIcon} subtitle={subtitle} title="" />
      </Paper>
    </Grid>
  );
};

export const RenderWidgets = React.memo(
  (props: WidgetProps) => {
    const {
      additionalFilters,
      dashboard,
      duration,
      jweToken,
      manualRefreshTimeStamp,
      metricDefinitions,
      preferences,
      resourceList,
      resources,
      savePref,
    } = props;

    const getCloudPulseGraphProperties = (
      widget: Widgets
    ): CloudPulseWidgetProperties => {
      const graphProp: CloudPulseWidgetProperties = {
        additionalFilters,
        ariaLabel: widget.label,
        authToken: '',
        availableMetrics: undefined,
        duration,
        errorLabel: 'Error While Loading Data',
        resourceIds: resources,
        resources: [],
        serviceType: dashboard?.service_type ?? '',
        timeStamp: manualRefreshTimeStamp,
        unit: widget.unit ?? '%',
        widget: { ...widget },
      };
      if (savePref) {
        graphProp.widget = setPreferredWidgetPlan(graphProp.widget);
      }
      return graphProp;
    };

    const getTimeGranularity = (scrapeInterval: string) => {
      const scrapeIntervalValue = getInSeconds(scrapeInterval);
      const index = getIntervalIndex(scrapeIntervalValue);
      return index < 0 ? allIntervalOptions[0] : allIntervalOptions[index];
    };

    const setPreferredWidgetPlan = (widgetObj: Widgets): Widgets => {
      const widgetPreferences = preferences?.widgets;
      const pref = widgetPreferences?.[widgetObj.label];
      if (pref) {
        return {
          ...widgetObj,
          aggregate_function:
            pref.aggregateFunction ?? widgetObj.aggregate_function,
          size: pref.size ?? widgetObj.size,
          time_granularity: {
            ...(pref.timeGranularity ?? widgetObj.time_granularity),
          },
        };
      } else {
        return {
          ...widgetObj,
          time_granularity: {
            label: 'Auto',
            unit: 'Auto',
            value: -1,
          },
        };
      }
    };

    if (!dashboard || !dashboard.widgets?.length) {
      return renderPlaceHolder(
        'No visualizations are available at this moment. Create Dashboards to list here.'
      );
    }

    if (
      !dashboard.service_type ||
      !Boolean(resources.length > 0) ||
      !jweToken?.token ||
      !Boolean(resourceList?.length)
    ) {
      return renderPlaceHolder(
        'Select Dashboard, Region and Resource to visualize metrics'
      );
    }

    // maintain a copy
    const newDashboard: Dashboard = createObjectCopy(dashboard)!;
    return (
      <Grid columnSpacing={2} container item rowSpacing={2} xs={12}>
        {{ ...newDashboard }.widgets.map((widget, index) => {
          // check if widget metric definition is available or not
          if (widget) {
            // find the metric defintion of the widget label
            const availMetrics = metricDefinitions?.data.find(
              (availMetrics: AvailableMetrics) =>
                widget.label === availMetrics.label
            );
            const cloudPulseWidgetProperties = getCloudPulseGraphProperties({
              ...widget,
            });

            // metric definition is available but time_granularity is not present
            if (
              availMetrics &&
              !cloudPulseWidgetProperties.widget.time_granularity
            ) {
              cloudPulseWidgetProperties.widget.time_granularity = getTimeGranularity(
                availMetrics.scrape_interval
              );
            }
            return (
              <CloudPulseWidget
                key={widget.label}
                {...cloudPulseWidgetProperties}
                authToken={jweToken?.token}
                availableMetrics={availMetrics}
                resources={resourceList!}
                savePref={savePref}
              />
            );
          } else {
            return <React.Fragment key={index}></React.Fragment>;
          }
        })}
      </Grid>
    );
  },
  (oldProps: WidgetProps, newProps: WidgetProps) => {
    if (
      !deepEqual(oldProps.dashboard, newProps.dashboard) ||
      !deepEqual(oldProps.additionalFilters, newProps.additionalFilters) ||
      !deepEqual(oldProps.duration, newProps.duration) ||
      !deepEqual(oldProps.jweToken, newProps.jweToken) ||
      !deepEqual(
        oldProps.manualRefreshTimeStamp,
        newProps.manualRefreshTimeStamp
      ) ||
      !deepEqual(oldProps.metricDefinitions, newProps.metricDefinitions) ||
      !deepEqual(oldProps.resourceList, newProps.resourceList) ||
      !deepEqual(oldProps.resources, newProps.resources)
    ) {
      return false;
    }

    return true;
  }
);