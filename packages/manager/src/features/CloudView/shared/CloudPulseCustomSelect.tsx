import React from 'react';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import { CloudPulseServiceTypeFiltersOptions } from 'src/featureFlags';
import { useGetCustomFiltersQuery } from 'src/queries/cloudview/customfilters';

export interface CloudPulseCustomSelectProps {
  apiResponseIdField?: string;
  apiResponseLabelField?: string;
  dataApiUrl?: string;
  errorText?: string;
  filterKey: string;
  filterType: string;
  handleSelectionChange: (filterKey: string, label: string) => void;
  isMultiSelect: boolean;
  maxSelections?: number;
  options?: CloudPulseServiceTypeFiltersOptions[];
  placeholder?: string;
  type: CloudPulseSelectTypes;
}

export enum CloudPulseSelectTypes {
  dynamic,
  static,
  predefined,
}

export const CloudPulseCustomSelect = React.memo(
  (props: CloudPulseCustomSelectProps) => {
    const [selectedResource, setResource] = React.useState<any>();

    const {
      data: queriedResources,
      isError,
      isLoading,
    } = useGetCustomFiltersQuery(
      props.dataApiUrl!,
      props.dataApiUrl != undefined,
      props.filterKey,
      props.apiResponseIdField ? props.apiResponseIdField : 'id',
      props.apiResponseLabelField ? props.apiResponseLabelField : 'label'
    );

    const getSelectedResources = () => {
      if (props.options && !selectedResource) {
        props.handleSelectionChange(
          props.filterKey,
          props.options[0].id.toString()
        );
        return props.options[0];
      } else if (queriedResources && !selectedResource) {
        props.handleSelectionChange(
          props.filterKey,
          queriedResources[0].id.toString()
        );
        return queriedResources[0];
      }

      return selectedResource;
    };

    if (
      props.type == CloudPulseSelectTypes.static ||
      (!isLoading && !isError && queriedResources)
    ) {
      return (
        <Autocomplete
          multiple={
            props.isMultiSelect != undefined ? props.isMultiSelect : false
          }
          onChange={(_: any, value: any) => {
            if (Array.isArray(value)) {
              props.handleSelectionChange(
                props.filterKey,
                value.map((obj) => obj.id.toString())
              );
            } else {
              props.handleSelectionChange(props.filterKey, value.id.toString());
            }

            if (
              props.maxSelections &&
              Array.isArray(value) &&
              value.length >= props.maxSelections
            ) {
              value = value.slice(0, props.maxSelections);
            }

            setResource(value);
          }}
          options={
            props.type == CloudPulseSelectTypes.static
              ? props.options!
              : queriedResources!
          }
          label=""
          placeholder={props.placeholder ? props.placeholder : 'Select a Value'}
          value={getSelectedResources()}
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

export default CloudPulseCustomSelect;
