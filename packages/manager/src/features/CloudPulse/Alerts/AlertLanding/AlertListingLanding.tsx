import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import { CreateAlertDefinition } from '../CreateAlert/CreateAlertDefinition';
import { AlertDetail } from './AlertDetail';
import { AlertListing } from './AlertListing';
// import { AlertDetail } from './AlertDetail';
const alerts = [
  {
    created: 'jan 16, 2024, 4:10 PM',
    createdBy: 'satkumar',
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
    ],
    description: 'Alert based on CPU Utilization 20%',
    id: 'someID',
    lastModified: 'jan 16, 2024, 4:10 PM',
    name: 'CPU Utilization - 20%',
    region: 'Chennai',
    serviceType: 'Linode',
    severity: '1',
    status: 'Enabled',
    triggerCondition: {
      criteria_condition: '',
      evaluation_period_seconds: '',
      polling_interval_seconds: '',
      trigger_occurrences: 0,
    },
    updated: 'jan 16, 2024, 4:10 PM',
    updated_by: 'satkumar',
  },
  {
    created: 'jan 16, 2024, 4:10 PM',
    createdBy: 'satkumar',
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
    ],
    id: 'someID1',
    lastModified: 'jan 16, 2024, 4:10 PM',
    name: 'CPU Utilization - 30%',
    region: 'Chennai',
    serviceType: 'Linode',
    severity: '1',
    status: 'Disabled',
    triggerCondition: {
      criteria_condition: '',
      evaluation_period_seconds: '',
      polling_interval_seconds: '',
      trigger_occurrences: 0,
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
