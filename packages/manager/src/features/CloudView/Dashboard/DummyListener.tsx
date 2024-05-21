import React from 'react';

import { useMutatePreferences, usePreferences } from 'src/queries/preferences';

import Event from './ListenerUtils';

export const CloudPulseListener = (props: any) => {
  // since preference is mutable and savable
  const preferenceRef = React.useRef<any>();

  const {
    data: { ...preferences },
    refetch: refetchPreferences,
  } = usePreferences();
  const { mutateAsync: updatePreferences } = useMutatePreferences();

  const handlPrefChange = (item: any) => {
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

  React.useEffect(() => {
    function logState(state: any) {
      if (preferences && preferences.aclpPreference) {
        if (preferences.aclpPreference.widgets) {
          const index = preferences.aclpPreference.widgets.findIndex(
            (obj: any) => obj.label && obj.label == state.label
          );

          if (index > -1) {
            preferences.aclpPreference.widgets[index] = {
              label: state.label,
              size: state.size,
            };
          } else {
            preferences.aclpPreference.widgets.push({
              label: state.label,
              size: state.size,
            });
          }

          handlPrefChange(preferences.aclpPreference);
        } else {
          preferences.aclpPreference.widgets = [];
          preferences.aclpPreference.widgets.push({
            label: state.label,
            size: state.size,
          });
          handlPrefChange(preferences.aclpPreference);
        }
      }
    }

    function updateTimeInterval(state: any) {
      if (preferences && preferences.aclpPreference) {
        preferences.aclpPreference.interval = state;
        handlPrefChange(preferences.aclpPreference);
      }
    }

    function updateTimeDuration(state: any) {
      if (preferences && preferences.aclpPreference) {
        preferences.aclpPreference.timeDuration = state;
        handlPrefChange(preferences.aclpPreference);
      }
    }

    function updateDashboard(state: any) {
      if (
        preferences &&
        preferences.aclpPreference &&
        preferences.aclpPreference.dashboardId != state
      ) {
        preferences.aclpPreference.dashboardId = state;
        preferences.aclpPreference.resources = [];
        preferences.aclpPreference.widgets = [];
        handlPrefChange(preferences.aclpPreference);
      }
    }

    function updateRegion(state: any) {
      if (
        preferences &&
        preferences.aclpPreference &&
        preferences.aclpPreference.region != state
      ) {
        preferences.aclpPreference.region = state;
        preferences.aclpPreference.resources = [];
        preferences.aclpPreference.widgets = [];
        handlPrefChange(preferences.aclpPreference);
      }
    }

    function updateResources(state: any) {
      if (preferences && preferences.aclpPreference ) {
        preferences.aclpPreference.resources = state;
        handlPrefChange(preferences.aclpPreference);
      }
    }

    Event.addListener('widgetChange', logState);

    Event.addListener('intervalChange', updateTimeInterval);

    Event.addListener('dashboardChange', updateDashboard);

    Event.addListener('regionChange', updateRegion);

    Event.addListener('resourceChange', updateResources);

    Event.addListener('timeDurationChange', updateTimeDuration);

    return () => {
      Event.removeListener('widgetChange', logState);
      Event.removeListener('intervalChange', updateTimeInterval);
      Event.removeListener('dashboardChange', updateDashboard);
      Event.removeListener('regionChange', updateRegion);
      Event.removeListener('resourceChange', updateResources);
      Event.removeListener('timeDurationChange', updateTimeDuration);
    };
  });

  return <></>;
};
