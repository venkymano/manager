import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import { useAlertDefinitionsQuery } from 'src/queries/cloudpulse/alerts';

import { AlertDetail } from './AlertDetail';
// import { AlertDetail } from './AlertDetail';
import { AlertListing } from './AlertListing';

export const AlertListingLanding = () => {
  const { data: alerts, isError, isLoading } = useAlertDefinitionsQuery();
  return (
    <Switch>
      <Route exact path="/monitor/cloudpulse/alerts/definitions">
        <AlertListing alerts={alerts?.data ?? []} />
      </Route>
      <Route
        exact
        path="/monitor/cloudpulse/alerts/definitions/detail/:alertId"
      >
        <AlertDetail alerts={alerts?.data ?? []} />
      </Route>
    </Switch>
  );
};