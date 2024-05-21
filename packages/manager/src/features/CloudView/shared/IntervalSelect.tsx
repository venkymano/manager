import * as React from 'react';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';

import Event from '../Dashboard/ListenerUtils';
import { usePreferences } from 'src/queries/preferences.js';
export interface CloudViewIntervalSelectProps {
  className?: string;
  defaultValue?: string;
  handleIntervalChange: (interval: string | undefined) => void;
}

export const CloudViewIntervalSelect = React.memo(
  (props: CloudViewIntervalSelectProps) => {
    const intervalOptions: any[] = [
      {
        label: '1 min',
        value: '1minute',
      },
      {
        label: '5 min',
        value: '5minute',
      },
      {
        label: '2 hrs',
        value: '2hour',
      },
      {
        label: '1 day',
        value: '1day',
      },
    ];

    const [selectedInterval, setInterval] = React.useState<string>(
      props.defaultValue ?? '1minute'
    );

    const {
      data: { ...preferences },
      refetch: refetchPreferences,
    } = usePreferences();

    React.useEffect(() => {
      Event.emit('intervalChange', selectedInterval);
      props.handleIntervalChange(selectedInterval);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedInterval]);

    if (!preferences) {
      return <></>;
    }

    return (
      <Autocomplete
        defaultValue={
          intervalOptions.find(
            (obj) => obj.value == preferences.aclpPreference.interval
          ) ?? intervalOptions[0]
        }
        onChange={(_: any, timeInterval: any) => {
          setInterval(timeInterval.value);
        }}
        className={props.className}
        data-testid="cloudview-interval-select"
        disableClearable
        fullWidth={false}
        isOptionEqualToValue={(option, value) => option.label === value.label}
        label=""
        noMarginTop={true}
        options={intervalOptions}
      />
    );
  }
);
