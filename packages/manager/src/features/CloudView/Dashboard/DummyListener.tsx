import React from 'react';

import { useMutatePreferences, usePreferences } from 'src/queries/preferences';

import { AclpConfig } from '../Models/CloudPulsePreferences';
import Event from './ListenerUtils';

export const CloudPulseListener = (props: any) => {
  // since preference is mutable and savable
  const preferenceRef = React.useRef<any>();

  const { data: preferences, refetch: refetchPreferences } = usePreferences();
  const { mutateAsync: updatePreferences } = useMutatePreferences();

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

    Event.addListener('widgetChange', logState);

    return () => {
      Event.removeListener('widgetChange', logState);
    };
  });

  return <></>;
};
