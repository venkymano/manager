import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import { AlertDetail } from './AlertDetail';
import { AlertListing } from './AlertListing';

const alerts = [
  {
    created: 'jan 16, 2024, 4:10 PM',
    created_by: 'satkumar',
    criteria: [
      {
        aggregation_type: 'average',
        dimension_filters: [
          {
            dimension_label: 'Operating system',
            operator: 'is',
            value: 'Windows',
          },
          {
            dimension_label: 'Operating system',
            operator: 'is',
            value: 'MacOs',
          },
        ],
        metric: 'CPU',
        operator: '>',
        value: 1,
      },
      {
        aggregation_type: 'average',
        dimension_filters: [
          {
            dimension_label: 'Operating system',
            operator: 'is',
            value: 'MacOs',
          },
        ],
        metric: 'CPU',
        operator: '>',
        value: 1,
      },
    ],
    description: 'Alert based on CPU Utilization 20%',
    id: 'someID',
    lastModified: 'jan 16, 2024, 4:10 PM',
    name: 'CPU Utilization - 20%',
    notification: {
      templateName: 'Email-08/2024',
      type: 'Email',
      values: {
        to: ['satkumar@akamai.com'],
      },
    },
    region: 'Chennai',
    service_type: 'Linode',
    severity: '1',
    status: 'Enabled',
    triggerCondition: {
      criteria_condition: 'All',
      evaluation_period_seconds: '30',
      polling_interval_seconds: '30',
      trigger_occurrences: 1,
    },
    updated: 'jan 16, 2024, 4:10 PM',
    updated_by: 'satkumar',
  },
  {
    created: 'jan 16, 2024, 4:10 PM',
    created_by: 'satkumar',
    criteria: [
      {
        aggregation_type: 'average',
        dimension_filters: [
          {
            dimension_label: 'Operating system',
            operator: 'is',
            value: 'MacOs',
          },
        ],
        metric: 'metric Name1',
        operator: '>',
        value: 1,
      },
      {
        aggregation_type: 'average',
        dimension_filters: [
          {
            dimension_label: 'Operating system',
            operator: 'is',
            value: 'MacOs',
          },
        ],
        metric: 'metric Name1',
        operator: '>',
        value: 1,
      },
    ],
    id: 'someID1',
    lastModified: 'jan 16, 2024, 4:10 PM',
    name: 'CPU Utilization - 30%',
    notification: {
      templateName: 'Email-08/2024',
      type: 'Email',
      values: {
        to: ['satkumar@akamai.com'],
      },
    },
    region: 'Chennai',
    service_type: 'Linode',
    severity: '1',
    status: 'Disabled',
    triggerCondition: {
      criteria_condition: 'All',
      evaluation_period_seconds: '30',
      polling_interval_seconds: '30',
      trigger_occurrences: 1,
    },
    updated: 'jan 16, 2024, 4:10 PM',
    updated_by: 'satkumar',
  },
];
export const AlertListingLanding = () => {
  return (
    <Switch>
      <Route exact path="/monitor/cloudpulse/alerts/definitions">
        <AlertListing />
      </Route>
      <Route
        exact
        path="/monitor/cloudpulse/alerts/definitions/detail/:alertId"
      >
        <AlertDetail alerts={alerts} />
      </Route>
    </Switch>
  );
};
