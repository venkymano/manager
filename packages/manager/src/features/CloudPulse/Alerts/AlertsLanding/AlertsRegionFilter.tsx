import React from 'react';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';

export interface AlertsRegionProps {
  handleSelectionChange: (region: string) => void;
  regionOptions: AlertsRegionOption[];
}

export interface AlertsRegionOption {
  id: string;
  label: string;
}

export const AlertsRegionFilter = React.memo((props: AlertsRegionProps) => {
  const { handleSelectionChange, regionOptions } = props;

  const [
    selectedRegion,
    setSelectedRegion,
  ] = React.useState<AlertsRegionOption>(regionOptions[0]);

  return (
    <Autocomplete
      onChange={(_e, region) => {
        if (region) {
          handleSelectionChange(region.id);
          setSelectedRegion(region);
        }
      }}
      textFieldProps={{
        hideLabel: true,
      }}
      disableClearable
      getOptionLabel={(option) => option.label}
      label="Select Region"
      options={regionOptions}
      placeholder="Select Region"
      value={selectedRegion}
    />
  );
});
