/* eslint-disable no-console */
import * as React from 'react';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import {
  useDBEngineResourcesQuery,
  useLinodeResourcesQuery,
  useLoadBalancerResourcesQuery,
} from 'src/queries/cloudview/resources';

import { RESOURCES } from '../Utils/CloudPulseConstants';
import {
  fetchUserPrefObject,
  updateGlobalFilterPreference,
} from '../Utils/UserPreference';

interface CloudViewResourceSelectProps {
  disabled: boolean;
  handleResourceChange: (resource: any) => void;
  placeholder?: string;
  resourceType: string | undefined;
  savePreferences: boolean;
  xFilter: { [key: string]: any };
}

export const CloudViewMultiResourceSelect = React.memo(
  (props: CloudViewResourceSelectProps) => {
    const resourceOptions: any = {};
    const [selectedResource, setResource] = React.useState<any>([]);
    // const defaultCalls = React.useRef(false);
    const getResourceList = () => {
      return props.resourceType && resourceOptions[props.resourceType]
        ? resourceOptions[props.resourceType]?.data
        : [];
    };

    ({ data: resourceOptions['linode'] } = useLinodeResourcesQuery(
      props.resourceType === 'linode',
      {},
      props.xFilter
    ));
    ({ data: resourceOptions['aclb'] } = useLoadBalancerResourcesQuery(
      props.resourceType === 'aclb',
      {},
      props.xFilter
    ));
    ({ data: resourceOptions['dbass'] } = useDBEngineResourcesQuery(
      // dbass integration
      props.resourceType === 'dbass' &&
        props.xFilter['region'] != undefined &&
        props.xFilter['dbEngine'] != undefined, // enable only if we have dbEngine and region
      props.xFilter,
      {}
    ));

    const getSelectedResources = () => {
      if (!props.savePreferences) {
        return undefined;
      }
      const defaultValue = fetchUserPrefObject()?.resources;
      const selectedResourceObj = getResourceList().filter(
        (obj) => defaultValue && defaultValue?.includes(obj.id)
      );
      props.handleResourceChange(selectedResourceObj.map((obj) => obj.id));
      return selectedResourceObj;
    };

    React.useEffect(() => {
      setResource([]);
    }, [props.xFilter]);
    return (
      <Autocomplete
        onChange={(_: any, resource: any, reason) => {
          updateGlobalFilterPreference({
            [RESOURCES]: resource.map((obj) => obj.id) ?? [],
          });
          setResource(resource);
          props.handleResourceChange(resource.map((obj) => obj.id));
        }}
        autoHighlight
        clearOnBlur
        data-testid={'Resource-select'}
        disabled={props.disabled}
        isOptionEqualToValue={(option, value) => option.label === value.label}
        key={'multi-select-resource'}
        label=""
        limitTags={2}
        multiple
        options={getResourceList()}
        placeholder={props.placeholder ?? 'Select Resources'}
        value={getSelectedResources()}
      />
    );
  },
  compareProps
);

function compareProps(
  oldProps: CloudViewResourceSelectProps,
  newProps: CloudViewResourceSelectProps
) {
  return JSON.stringify(oldProps.xFilter) == JSON.stringify(newProps.xFilter);
}
