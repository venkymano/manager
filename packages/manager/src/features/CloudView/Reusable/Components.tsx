import React, { MemoExoticComponent } from 'react';

import CloudPulseCustomSelect from '../shared/CloudPulseCustomSelect';
import { CloudViewRegionSelect } from '../shared/RegionSelect';
import { CloudViewMultiResourceSelect } from '../shared/ResourceMultiSelect';
import { CloudPulseTimeRangeSelect } from '../shared/TimeRangeSelect';

const Components: { [key: string]: MemoExoticComponent<any> } = {
  customDropDown: CloudPulseCustomSelect,
  region: CloudViewRegionSelect,
  relative_time_duration: CloudPulseTimeRangeSelect,
  resource_id: CloudViewMultiResourceSelect,
};

const renderComponent = (props: any) => {
  if (typeof Components[props.componentKey] !== 'undefined') {
    return React.createElement(Components[props.componentKey], {
      ...props
    });
  }

  return <div></div>;
};

export default renderComponent;
