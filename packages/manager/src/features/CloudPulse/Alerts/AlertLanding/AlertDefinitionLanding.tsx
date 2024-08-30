import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import { CreateAlertDefinition } from '../CreateAlert/CreateAlertDefinition';
import { AlertListingLanding } from './AlertListingLanding';
import { AlertDetail } from './AlertDetail';

export const AlertDefinitionLanding = () => {
  return (
    <Switch>
      <Route
        exact
        component={() => <CreateAlertDefinition />}
        path="/monitor/cloudpulse/alerts/definitions/create"
      />
      <Route
        component={AlertListingLanding}
        path="/monitor/cloudpulse/alerts/definitions"
      />
      {/* <Route
        component={AlertDetail}
        exact
        path="/monitor/cloudpulse/alerts/definitions/detail/:alertId"
      /> */}
      
    </Switch>
  );
};
