/* eslint-disable no-console */
import { Dashboard } from '@linode/api-v4';
import * as React from 'react';

import { RegionSelect } from 'src/components/RegionSelect/RegionSelect';
import { useRegionsQuery } from 'src/queries/regions';

import { REGION, RESOURCES } from '../Utils/CloudPulseConstants';
import {
  fetchUserPrefObject,
  updateGlobalFilterPreference,
} from '../Utils/UserPreference';

export interface CloudViewRegionSelectProps {
  handleRegionChange: (region: string | undefined) => void;
  placeholder?: string;
  savePreferences: boolean;
  selectedDashboard?: Dashboard;
}

export const CloudViewRegionSelect = React.memo(
  (props: CloudViewRegionSelectProps) => {
    const { data: regions } = useRegionsQuery();

    const getPrefferedRegion = () => {
      if (!props.savePreferences) {
        return undefined;
      }
      const defaultValue = fetchUserPrefObject()?.region;
      props.handleRegionChange(defaultValue);

      return defaultValue;
    };

    if (!props.selectedDashboard || !regions) {
      return (
        <RegionSelect
          currentCapability={undefined}
          fullWidth
          handleSelection={(value) => {}}
          label=""
          noMarginTop
          placeholder={props.placeholder}
          regions={[]}
          selectedId={''}
        />
      );
    }

    return (
      <RegionSelect
        handleSelection={(value) => {
          updateGlobalFilterPreference({ [REGION]: value, [RESOURCES]: [] });
          props.handleRegionChange(value);
        }}
        currentCapability={undefined}
        fullWidth
        isClearable={true}
        label=""
        noMarginTop
        placeholder={props.placeholder}
        regions={regions ? regions : []}
        selectedId={getPrefferedRegion()!}
      />
    );
  },
  compareProps
);

function compareProps(
  oldProps: CloudViewRegionSelectProps,
  newProps: CloudViewRegionSelectProps
) {
  return oldProps.selectedDashboard?.id == newProps.selectedDashboard?.id;
}
