import React from 'react';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import { CloudPulseServiceTypeFiltersOptions } from 'src/featureFlags';
import { useGetCustomFiltersQuery } from 'src/queries/cloudview/customfilters';

import {
  fetchUserPrefObject,
  updateGlobalFilterPreference,
} from '../Utils/UserPreference';
import { Chip } from '@mui/material';

export interface CloudPulseCustomSelectProps {
  apiResponseIdField?: string;
  apiResponseLabelField?: string;
  clearSelections?: string[];
  dataApiUrl?: string;
  errorText?: string;
  filterKey: string;
  filterType: string;
  handleSelectionChange: (filterKey: string, value: string | string[] | number | number[] | undefined) => void;
  isMultiSelect?: boolean;
  maxSelections?: number;
  options?: CloudPulseServiceTypeFiltersOptions[];
  placeholder?: string;
  savePreferences?: boolean;
  type: CloudPulseSelectTypes;
}

export enum CloudPulseSelectTypes {
  dynamic,
  static,
}

export const CloudPulseCustomSelect = React.memo(
  (props: CloudPulseCustomSelectProps) => {
    const [selectedResource, setResource] = React.useState<CloudPulseServiceTypeFiltersOptions | 
    CloudPulseServiceTypeFiltersOptions[]>();
    const defaultSet = React.useRef(false);

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

    React.useEffect(() => {

      if(props.savePreferences) {
        const defaultValue = fetchUserPrefObject()[props.filterKey];

        setResource(getDefaultSelectionsFromPreferences(defaultValue, 
                                props.type==CloudPulseSelectTypes.static?props.options:queriedResources))
      }

    }, [props.savePreferences]);

    const getDefaultSelectionsFromPreferences = (defaultValue: string | string[] | number | number[] | null, 
      options:CloudPulseServiceTypeFiltersOptions[] | undefined
    ): CloudPulseServiceTypeFiltersOptions[]| CloudPulseServiceTypeFiltersOptions | undefined  => {

      if(!options || options.length == 0) {
        return props.isMultiSelect ? [] : undefined;
      }

      if (props.isMultiSelect && Array.isArray(defaultValue)) {
        
        const selectedValues = options?.filter((obj:CloudPulseServiceTypeFiltersOptions) =>
          Array.of(...defaultValue).includes(obj.id)
        );
        props.handleSelectionChange(
          props.filterKey,
          selectedValues!.map((obj) => obj.id)
        );
        return selectedValues;
      } else if (!props.isMultiSelect) {
        const selectedValue = options.find(
          (obj) => obj.id == defaultValue
        );
        if (selectedValue) {
          props.handleSelectionChange(props.filterKey, selectedValue.id);
        }
        return selectedValue;
      }

      return props.isMultiSelect ? [] : undefined;
    };

      if(queriedResources) {
        console.log(queriedResources.length)
        console.log(queriedResources)
      }
      return (        
        <Autocomplete
          multiple={
            props.isMultiSelect
          }
          onChange={(_, value) => {
            if (Array.isArray(value)) {
              props.handleSelectionChange(
                props.filterKey,
                value.map((obj) => obj.id.toString())
              );
              updateGlobalFilterPreference({
                [props.filterKey]: value.map((obj) => obj.id.toString()),
              });
            } else {
              props.handleSelectionChange(
                props.filterKey,
                value ? value.id.toString() : undefined
              );
              updateGlobalFilterPreference({
                [props.filterKey]: value ? value?.id.toString() : null,
              });
            }

            if (props.clearSelections && value == null) {
              props.clearSelections.forEach((selection) => {
                updateGlobalFilterPreference({ [selection]: undefined });
              });
            }

            if (
              props.maxSelections &&
              Array.isArray(value) &&
              value.length >= props.maxSelections
            ) {
              value = value.slice(0, props.maxSelections);
            }

            setResource(value ?? undefined);
          }}
          disabled={isLoading && isError && !queriedResources}
          options={
            props.type == CloudPulseSelectTypes.static
              ? props.options!
              : queriedResources!
          }
          label=""
          placeholder={props.placeholder ? props.placeholder : 'Select a Value'}
          value={selectedResource ?? []}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderTags={(tagValue, getTagProps) => {
            return tagValue.map((option, index) => (
              <Chip {...getTagProps({index})} key={option.id} label={option.label} />
            ))
          }}
          style={{
            width:'95%'
          }}
        />
      );
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
