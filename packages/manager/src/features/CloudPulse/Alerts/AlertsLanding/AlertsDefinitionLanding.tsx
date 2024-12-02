import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import { CreateAlertDefinition } from '../CreateAlert/CreateAlertDefinition';
import { AlertListingLanding } from './AlertListingLanding';

export const AlertDefinitionLanding = () => {
  return (
    <Switch>
      <Route
        component={() => <AlertListingLanding />}
        path="/monitor/alerts/definitions"
      />
      <Route
        component={() => <CreateAlertDefinition />}
        path="/monitor/alerts/definitions/create"
      />
    </Switch>
  );
};
