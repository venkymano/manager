import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import { useAllAlertDefinitionsQuery } from 'src/queries/cloudpulse/alerts';

import { AlertDetail } from '../AlertsDetail/AlertDetail';
import { AlertListing } from './AlertListing';

export const AlertListingLanding = () => {
  const { data: alerts } = useAllAlertDefinitionsQuery();
  return (
    <Switch>
      <Route exact path="/monitor/alerts/definitions">
        <AlertListing alerts={alerts ?? []} />
      </Route>
      <Route
        exact
        path="/monitor/alerts/definitions/detail/:serviceType/:alertId"
      >
        <AlertDetail />
      </Route>
    </Switch>
  );
};
