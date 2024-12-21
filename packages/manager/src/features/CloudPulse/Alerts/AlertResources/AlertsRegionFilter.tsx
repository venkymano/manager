import React from 'react';

import { RegionMultiSelect } from 'src/components/RegionSelect/RegionMultiSelect';

import type { Region } from '@linode/api-v4';

export interface AlertsRegionProps {
  handleSelectionChange: (regions: string[]) => void;
  regionOptions: Region[];
}

export interface AlertsRegionOption {
  id: string;
  label: string;
}

export const AlertsRegionFilter = React.memo((props: AlertsRegionProps) => {
  const { handleSelectionChange, regionOptions } = props;

  const [selectedRegion, setSelectedRegion] = React.useState<Region[]>([]);
  return (
    <RegionMultiSelect
      onChange={(ids: string[]) => {
        if (!ids || ids.length === 0) {
          handleSelectionChange(regionOptions.map(({ id }) => id));
        } else {
          handleSelectionChange(ids);
        }

        setSelectedRegion(
          regionOptions.filter((region) => ids.includes(region.id))
        );
      }}
      slotProps={{
        popper: {
          placement: 'bottom',
        },
      }}
      textFieldProps={{
        hideLabel: true,
      }}
      currentCapability={undefined}
      disableSelectAll
      isClearable={true}
      label="Select Regions"
      limitTags={1}
      placeholder={Boolean(selectedRegion?.length) ? '' : 'Select Regions'}
      regions={regionOptions}
      selectedIds={selectedRegion.map((region) => region.id)}
      value={selectedRegion}
    />
  );
});
