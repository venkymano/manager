import React from 'react';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import { CloudPulseServiceTypeFiltersOptions } from 'src/featureFlags';
import { useGetCustomFiltersQuery } from 'src/queries/cloudview/customfilters';

export interface CloudPulseCustomSelectProps {
  dataApiUrl?: string;
  filterKey: string;
  handleSelectionChange: (label: string, filterKey: string) => void;
  options?: CloudPulseServiceTypeFiltersOptions[];
  placeholder?: string;
  type: CloudPulseSelectTypes;
  filterType: string;
  isMultiSelect: boolean;
  errorText?: string;
  maxSelections?: number;
}

export enum CloudPulseSelectTypes {
  dynamic,
  static,
}

export const CloudPulseCustomSelect = React.memo(
  (props: CloudPulseCustomSelectProps) => {

    const [selectedResource, setResource] = React.useState<any>([]);

    const {data: queriedResources, isLoading, isError} = useGetCustomFiltersQuery(props.dataApiUrl!, 
      props.dataApiUrl != undefined,
      props.filterKey
    );



    if (props.type == CloudPulseSelectTypes.static || 
        (!isLoading && !isError && queriedResources)
    ) {
      return (
        <Autocomplete
          onChange={(_: any, value: any[]) => {
            props.handleSelectionChange(value[0], props.filterKey)

            if(props.maxSelections && value.length >= props.maxSelections) {
              value = value.slice(0, props.maxSelections);
            }

            setResource(value);
          }}
          key={props.filterKey}
          label=""
          options={props.type == CloudPulseSelectTypes.static ? props.options! : queriedResources!}
          placeholder={props.placeholder ? props.placeholder : 'Select a Value'}
          multiple={props.isMultiSelect!=undefined ? props.isMultiSelect : false}
          value={selectedResource}
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