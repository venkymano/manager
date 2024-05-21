/* eslint-disable no-console */
import * as React from 'react';

import { RegionSelect } from 'src/components/RegionSelect/RegionSelect';
import { usePreferences } from 'src/queries/preferences';
import { useRegionsQuery } from 'src/queries/regions';

import Event from '../Dashboard/ListenerUtils';

export interface CloudViewRegionSelectProps {
  defaultValue?: string;
  handleRegionChange: (region: string | undefined) => void;
}

export const CloudViewRegionSelect = React.memo(
  (props: CloudViewRegionSelectProps) => {
    const { data: regions } = useRegionsQuery();
    const [selectedRegion, setRegion] = React.useState<string>();

    const {
      data: { ...preferences },
      refetch: refetchPreferences,
    } = usePreferences();

    React.useEffect(() => {
      Event.emit('regionChange', selectedRegion);
      props.handleRegionChange(selectedRegion);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedRegion]);

    const getPrefferedRegion = () => {
      if (
        !selectedRegion &&
        preferences &&
        preferences.aclpPreference &&
        preferences.aclpPreference.region
      ) {
        setRegion(preferences.aclpPreference.region);
        return preferences.aclpPreference.region
          ? preferences.aclpPreference.region
          : null;
      }

      return selectedRegion;
    };

    return (
      <RegionSelect
        handleSelection={(value) => {
          setRegion(value);
        }}
        currentCapability={undefined}
        fullWidth
        isClearable={false}
        label=""
        noMarginTop
        regions={regions ? regions : []}
        selectedId={getPrefferedRegion()}
      />
    );
  }
);
