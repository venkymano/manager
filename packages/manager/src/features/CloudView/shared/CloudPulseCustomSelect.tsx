import React from 'react';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import Select from 'src/components/EnhancedSelect';
import { CloudPulseServiceTypeFiltersOptions } from 'src/featureFlags';
import { useGetCustomFiltersQuery } from 'src/queries/cloudview/customfilters';

import {
  fetchUserPrefObject,
  updateGlobalFilterPreference,
} from '../Utils/UserPreference';

export interface CloudPulseCustomSelectProps {
  apiResponseIdField?: string;
  apiResponseLabelField?: string[];
  dataApiUrl?: string;
  errorText?: string;
  filterKey: string;
  filterType: string;
  handleSelectionChange: (filterKey: string, value: any) => void;
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
  predefined,
}

export const CloudPulseCustomSelect = React.memo(
  (props: CloudPulseCustomSelectProps) => {
    const [selectedResource, setResource] = React.useState<any>();
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
      props.apiResponseLabelField ? props.apiResponseLabelField : ['label']
    );

    const getSelectedValues = () => {
      // if there is no preferences, just return undefined
      if (!props.savePreferences) {
        return undefined;
      }

      if (props.type == CloudPulseSelectTypes.static) {
        const defaultValue = fetchUserPrefObject()[props.filterKey];
        if (props.isMultiSelect && Array.isArray(defaultValue)) {
          const selectedValues = props.options?.filter((obj) =>
            defaultValue.includes(obj.id)
          );
          props.handleSelectionChange(
            props.filterKey,
            selectedValues!.map((obj) => obj.id)
          );
          return selectedValues;
        } else if (!props.isMultiSelect) {
          const selectedValue = props.options?.find(
            (obj) => obj.id == defaultValue
          );
          if (selectedValue) {
            props.handleSelectionChange(props.filterKey, selectedValue.id);
          }
          return selectedValue;
        }
      } else if (queriedResources && queriedResources.length > 0) {
        const defaultValue = fetchUserPrefObject()[props.filterKey];
        if (props.isMultiSelect && Array.isArray(defaultValue)) {
          const selectedValues = queriedResources?.filter((obj) =>
            defaultValue.includes(obj.id)
          );
          props.handleSelectionChange(
            props.filterKey,
            selectedValues.map((obj) => obj.id)
          );
          return selectedValues;
        } else if (!props.isMultiSelect) {
          const selectedValue = queriedResources?.find(
            (obj) => obj.id == defaultValue
          );

          if (selectedValue) {
            props.handleSelectionChange(props.filterKey, selectedValue.id);
          }
          return selectedValue;
        }
      }
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
              updateGlobalFilterPreference({
                [props.filterKey]: value.map((obj) => obj.id.toString()),
              });
            } else {
              props.handleSelectionChange(
                props.filterKey,
                value ? value.id.toString() : null
              );
              updateGlobalFilterPreference({
                [props.filterKey]: value ? value.id.toString() : null,
              });
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
          defaultValue={getSelectedValues() ?? undefined}
          label=""
          placeholder={props.placeholder ? props.placeholder : 'Select a Value'}
          // value={props.isMultiSelect ? getSelectedValues() : undefined!}
        />
      );
    } else {
      return (
        <Select
          disabled={true}
          errorText={isError ? 'Error while reading filters from API' : ''}
          label=""
          onChange={() => {}}
          options={[]}
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
