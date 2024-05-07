import {
  Dashboard,
  TimeDuration,
  TimeGranularity,
  Widgets,
} from '@linode/api-v4';
import { Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import * as React from 'react';

import CloudViewIcon from 'src/assets/icons/entityIcons/cv_overview.svg';
import { Placeholder } from 'src/components/Placeholder/Placeholder';
import { useCloudViewJWEtokenQuery } from 'src/queries/cloudview/dashboards';
import { useResourcesQuery } from 'src/queries/cloudview/resources';

import { FiltersObject } from '../Models/GlobalFilterProperties';
import {
  CloudViewWidget,
  CloudViewWidgetProperties,
} from '../Widget/CloudViewWidget';
import { getResourceIDsPayload } from '../Utils/CloudPulseUtils';

export interface DashboardProperties {
  dashbaord: Dashboard; // this will be done in upcoming sprint, from dashboard to dashboard id
  duration: TimeDuration;
  // on any change in dashboard, this is optional
  onDashboardChange?: (dashboard: Dashboard) => void;
  resource: string[];
  step?: TimeGranularity; // will be moved to widget level
}

export const CloudPulseDashboard = (props: DashboardProperties) => {
  const { data: resources } = useResourcesQuery(
    props?.dashbaord?.service_type != undefined,
    {},
    {},
    props?.dashbaord?.service_type
  );

  const { data: jweToken, isError } = useCloudViewJWEtokenQuery(
    props?.dashbaord?.service_type,
    getResourceIDsPayload(resources),
    resources?.data ? true : false
  );

  const [
    cloudViewGraphProperties,
    setCloudViewGraphProperties,
  ] = React.useState<CloudViewWidgetProperties>(
    {} as CloudViewWidgetProperties
  );

  React.useEffect(() => {
    // set as dashboard filter
    setCloudViewGraphProperties({
      ...cloudViewGraphProperties,
      globalFilters: constructGlobalFilterConstraint(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.duration, props.resource, props.step]); // execute every time when there is dashboardFilters change

  const StyledErrorState = styled(Placeholder, {
    label: 'StyledErrorState',
  })({
    height: '100%',
  });

  if (isError) {
    return (
      <Paper style={{ height: '100%' }}>
        <StyledErrorState title="Failed to get jwe token" />
      </Paper>
    );
  }

  const constructGlobalFilterConstraint = () => {
    const filter = {} as FiltersObject;
    filter.duration = props.duration;
    filter.resource = props.resource;
    filter.step = props.step;
    return filter;
  };

  const getCloudViewGraphProperties = (widget: Widgets) => {
    const graphProp: CloudViewWidgetProperties = {} as CloudViewWidgetProperties;
    graphProp.widget = { ...widget };
    graphProp.globalFilters = constructGlobalFilterConstraint();
    graphProp.unit = widget.unit ? widget.unit : '%';
    graphProp.ariaLabel = widget.label;
    graphProp.errorLabel = 'Error While loading data';

    return graphProp;
  };

  const handleWidgetChange = (widget: Widgets) => {
    if (!props.onDashboardChange) {
      // service owners might not use this, so undefined check is needed here
      return;
    }
    const dashboard = { ...props.dashbaord };

    const index = dashboard.widgets.findIndex(
      (obj) => obj.label === widget.label
    );

    dashboard.widgets[index] = { ...widget };

    props.onDashboardChange(dashboard);
  };

  const RenderWidgets = () => {
    if (props.dashbaord != undefined) {
      if (
        props.dashbaord?.service_type &&
        cloudViewGraphProperties.globalFilters?.resource &&
        cloudViewGraphProperties.globalFilters?.resource.length > 0 &&
        jweToken?.token &&
        resources?.data
      ) {
        return (
          <Grid columnSpacing={1.5} container rowSpacing={0} spacing={2}>
            {props.dashbaord.widgets.map((element, index) => {
              if (element && element != undefined) {
                return (
                  <CloudViewWidget
                    key={index}
                    {...getCloudViewGraphProperties(element)}
                    authToken={jweToken?.token}
                    handleWidgetChange={handleWidgetChange}
                    resources={resources.data}
                  />
                );
              } else {
                return <React.Fragment key={index}></React.Fragment>;
              }
            })}{' '}
          </Grid>
        );
      } else {
        return renderPlaceHolder(
          'Select Service Type, Region and Resource to visualize metrics'
        );
      }
    } else {
      return renderPlaceHolder(
        'No visualizations are available at this moment. Create Dashboards to list here.'
      );
    }
  };

  const renderPlaceHolder = (subtitle: string) => {
    return (
      <Paper>
        <StyledPlaceholder icon={CloudViewIcon} subtitle={subtitle} title="" />
      </Paper>
    );
  };

  const StyledPlaceholder = styled(Placeholder, {
    label: 'StyledPlaceholder',
  })({
    flex: 'auto',
  });

  return <RenderWidgets />;
};
