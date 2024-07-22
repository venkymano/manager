import { Box } from '@mui/material';
import React, { MemoExoticComponent } from 'react';

import CloudPulseCustomSelect from './CloudPulseCustomSelect';
import { CloudViewRegionSelect } from './RegionSelect';
import { CloudViewMultiResourceSelect } from './ResourceMultiSelect';
import { CloudPulseTimeRangeSelect } from './TimeRangeSelect';

const Components: { [key: string]: MemoExoticComponent<any> } = {
  customDropDown: CloudPulseCustomSelect,
  region: CloudViewRegionSelect,
  relative_time_duration: CloudPulseTimeRangeSelect,
  resource_id: CloudViewMultiResourceSelect,
};

const renderComponent = (props: any) => {
  if (typeof Components[props.componentKey] !== 'undefined') {
    return React.createElement(Components[props.componentKey], {
      ...props,
    });
  }

  return <Box></Box>;
};

export default renderComponent;
