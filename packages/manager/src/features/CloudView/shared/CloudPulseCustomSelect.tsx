import { CloudPulseSelectOptions } from '@linode/api-v4';
import React from 'react';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';

export interface CloudPulseCustomSelectProps {
  optionFromApi?: boolean;
  filterKey: string;
  handleSelectionChange: (label: string, filterKey: string) => void;
  options?: CloudPulseSelectOptions[];
  placeholder?: string;
  type: CloudPulseSelectTypes;
  filterType: string;
  isMultiSelect: boolean;
  errorText?: string;
}

export enum CloudPulseSelectTypes {
  dynamic,
  static,
}

export const CloudPulseCustomSelect = React.memo(
  (props: CloudPulseCustomSelectProps) => {
    if (props.type == CloudPulseSelectTypes.static) {
      return (
        <Autocomplete
          onChange={(_: any, value: CloudPulseSelectOptions) =>
            props.handleSelectionChange(value.label, props.filterKey)
          }
          key={props.filterKey}
          label=""
          options={props.options ? props.options : []}
          placeholder={props.placeholder ? props.placeholder : 'Select a Value'}
        />
      );
    } else {
      return (
        <Autocomplete
          disabled={true}
          label=""
          options={props.options ? props.options : []}
          placeholder={props.placeholder ? props.placeholder : 'Select a Value'}
        />
      );
    }
  },
  compareProps
);

function compareProps(
  oldProps: CloudPulseCustomSelectProps,
  newProps: CloudPulseCustomSelectProps
) {
  return oldProps.options?.length == newProps.options?.length;
}
