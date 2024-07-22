import {
  AvailableMetrics,
  Filters,
  TimeDuration,
  TimeGranularity,
  Widgets,
} from '@linode/api-v4';
import { Paper, Theme } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import React from 'react';
import { makeStyles } from 'tss-react/mui';

import { CircleProgress } from 'src/components/CircleProgress';
import { Divider } from 'src/components/Divider';
import { Typography } from 'src/components/Typography';
import { CloudPulseResourceTypeMap } from 'src/featureFlags';
import { useFlags } from 'src/hooks/useFlags';
import { useCloudViewMetricsQuery } from 'src/queries/cloudview/metrics';
import { useProfile } from 'src/queries/profile';
import { isToday as _isToday } from 'src/utilities/isToday';
import { roundTo } from 'src/utilities/roundTo';
import { getMetrics } from 'src/utilities/statMetrics';

import {
  AGGREGATE_FUNCTION,
  SIZE,
  TIME_GRANULARITY,
} from '../Utils/CloudPulseConstants';
import {
  convertStringToCamelCasesWithSpaces,
  convertTimeDurationToStartAndEndTimeRange,
  getDimensionName,
} from '../Utils/CloudPulseUtils';
import {
  convertValueToUnit,
  formatToolTip,
  generateUnitByBaseUnit,
  isBitsOrBytesUnit,
} from '../Utils/UnitConversion';
import {
  fetchUserPrefObject,
  updateWidgetPreference,
} from '../Utils/UserPreference';
import { COLOR_MAP } from '../Utils/WidgetColorPalette';
import { CloudViewLineGraph } from './CloudViewLineGraph';
import { AggregateFunctionComponent } from './Components/AggregateFunctionComponent';
import { IntervalSelectComponent } from './Components/IntervalSelectComponent';
import { ZoomIcon } from './Components/Zoomer';
import { seriesDataFormatter } from './Formatters/CloudViewFormatter';

export interface CloudViewWidgetProperties {
  // we can try renaming this CloudViewWidget
  ariaLabel?: string;
  authToken: string;
  availableMetrics: AvailableMetrics | undefined;
  duration: TimeDuration;
  errorLabel?: string; // error label can come from dashboard
  globalFilters?: CloudPulseWidgetFilters[];
  // any change in the current widget, call and pass this function and handle in parent component
  handleWidgetChange: (widget: Widgets) => void;

  resourceIds: string[];
  resources: any[]; // list of resources in a service type
  savePref?: boolean;
  serviceType: string;
  timeStamp: number;
  unit: string; // this should come from dashboard, which maintains map for service types in a separate API call
  useColorIndex?: number;
  widget: Widgets; // this comes from dashboard, has inbuilt metrics, agg_func,group_by,filters,gridsize etc , also helpful in publishing any changes
}

export interface CloudPulseWidgetFilters {
  filterKey: string;
  filterValue: any;
  isDimensionFilter: boolean;
}

const useStyles = makeStyles()((theme: Theme) => ({
  title: {
    '& > span': {
      color: theme.palette.text.primary,
    },
    color: theme.color.headline,
    fontFamily: theme.font.bold,
    fontSize: '1.30rem',
    marginLeft: '8px',
  },
}));

export const CloudViewWidget = React.memo(
  (props: CloudViewWidgetProperties) => {
    const { classes } = useStyles();

    const { data: profile } = useProfile();

    const timezone = profile?.timezone || 'US/Eastern';

    const [data, setData] = React.useState<Array<any>>([]);

    const jweTokenExpiryError = 'Token expired';

    const [legendRows, setLegendRows] = React.useState<any[]>([]);

    const [today, setToday] = React.useState<boolean>(false);

    const flags = useFlags();

    const isBitsOrBytes = isBitsOrBytesUnit(props.unit);

    // const [
    //   selectedInterval,
    //   setSelectedInterval,
    // ] = React.useState<TimeGranularity>({ ...props.widget?.time_granularity });

    const [widget, setWidget] = React.useState<Widgets>({ ...props.widget }); // any change in agg_functions, step, group_by, will be published to dashboard component for save

    const [currentUnit, setCurrentUnit] = React.useState<any>(
      generateUnitByBaseUnit(0, props.unit) ?? props.unit
    );

    const getCloudViewMetricsRequestFromFilter = (): any => {
      const request: { [key: string]: any } = {};
      request.aggregate_function = widget.aggregate_function;
      request.group_by = widget.group_by;
      request.metric = widget.metric!;
      request.time_granularity = {
        unit: widget.time_granularity.unit,
        value: widget.time_granularity.value,
      };

      if (props.globalFilters) {
        for (
          let i = 0;
          props.globalFilters && i < props.globalFilters?.length;
          i++
        ) {
          if (!props.globalFilters[i].isDimensionFilter) {
            request[props.globalFilters[i].filterKey] =
              props.globalFilters[i].filterValue;
          } else {
            request['filters'] = request['filters'] ?? [];
            request['filters'].push({
              key: props.globalFilters[i].filterKey,
              operator: Array.isArray(props.globalFilters[i].filterValue)
                ? 'in'
                : 'eq',
              value: Array.isArray(props.globalFilters[i].filterValue)
                ? props.globalFilters[i].filterValue.join(',')
                : props.globalFilters[i].filterValue,
            });
          }
        }
      }

      // check hybrid
      if (!request['resource_id']) {
        request['resource_id'] = props.resourceIds;
      }

      if (!request['relative_time_duration']) {
        request['relative_time_duration'] = props.duration;
      }

      // any other filters apart from above two should come in globalFiltersProp

      return request;
    };

    const tooltipValueFormatter = (value: number, unit: string) =>
      `${roundTo(value)} ${unit}`;

    const getServiceType = () => {
      return props.widget.service_type
        ? props.widget.service_type!
        : props.serviceType
        ? props.serviceType
        : '';
    };

    const getLabelName = (metric: any, serviceType: string) => {
      // aggregated metric, where metric keys will be 0
      if (Object.keys(metric).length == 0) {
        // in this case retrurn widget label and unit
        return props.widget.label + ' (' + props.widget.unit + ')';
      }

      const results =
        flags.aclpResourceTypeMap && flags.aclpResourceTypeMap.length > 0
          ? flags.aclpResourceTypeMap.filter(
              (obj: CloudPulseResourceTypeMap) =>
                obj.serviceType === serviceType
            )
          : [];

      const flag = results && results.length > 0 ? results[0] : undefined;

      return getDimensionName(metric, flag, props.resources);
    };

    const {
      data: metricsList,
      error,
      isLoading,
      status,
    } = useCloudViewMetricsQuery(
      getServiceType()!,
      getCloudViewMetricsRequestFromFilter(),
      props,
      widget.aggregate_function +
        '_' +
        widget.group_by +
        '_' +
        widget.time_granularity +
        '_' +
        widget.metric +
        '_' +
        widget.label +
        '_' +
        props.timeStamp ?? '' + '_' + props.globalFilters,
      flags != undefined,
      flags.aclpReadEndpoint!
    ); // fetch the metrics on any property change

    React.useEffect(() => {
      // on any change in the widget object, just publish the changes to parent component using a callback function
      if (
        props.widget.size != widget.size ||
        props.widget.aggregate_function !== widget.aggregate_function ||
        props.widget.time_granularity?.unit !== widget.time_granularity?.unit ||
        props.widget.time_granularity?.value !== widget.time_granularity?.value
      ) {
        props.handleWidgetChange(widget);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [widget]);

    /**
     * This will be executed, each time when we receive response from metrics api
     * and does formats the data compatible for the graph
     */
    React.useEffect(() => {
      const dimensions: any[] = [];
      const legendRowsData: any[] = [];

      // for now we will use this, but once we decide how to work with coloring, it should be dynamic
      let colors: string[] = COLOR_MAP.get('default')!; // choose default theme by default
      if (props.widget.color) {
        colors = COLOR_MAP.get(props.widget.color)!;
      }

      // for now , lets stick with the default theme
      // colors = COLOR_MAP.get('default')!;

      const startEnd = convertTimeDurationToStartAndEndTimeRange(
        props!.duration! ??
          props.globalFilters?.find(
            (filterValue) => filterValue.filterKey == 'relative_time_duration'
          )?.filterValue
      );

      setToday(_isToday(startEnd.start, startEnd.end));

      if (
        status == 'success' &&
        metricsList.data &&
        metricsList.data.result.length > 0
      ) {
        let index = 0;

        metricsList.data.result.forEach((graphData: any) => {
          // todo, move it to utils at a widget level
          if (graphData == undefined || graphData == null) {
            return;
          }
          const color = colors[index];
          const dimension = {
            backgroundColor: color,
            data: seriesDataFormatter(
              graphData.values,
              startEnd ? startEnd.start : graphData.values[0][0],
              startEnd
                ? startEnd.end
                : graphData.values[graphData.values.length - 1][0]
            ),
            label: getLabelName(graphData.metric, getServiceType()!),
          };

          // construct a legend row with the dimension
          const legendRow = {
            data: getMetrics(dimension.data as number[][]),
            format: (value: number) =>
              tooltipValueFormatter(value, widget.unit),
            legendColor: color,
            legendTitle: dimension.label,
          };
          legendRowsData.push(legendRow);
          dimensions.push(dimension);
          index = index + 1;
        });

        formatBytesData(dimensions, legendRowsData);
        // chart dimensions
        setData(dimensions);
        setLegendRows(legendRowsData);

        // chart dimensions
        setData(dimensions);
        setLegendRows(legendRowsData);
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, metricsList]);

    const formatBytesData = (dimensions: any, legendRowsData: any) => {
      if ((props.unit && !isBitsOrBytes) || !dimensions) {
        return;
      }
      let maxValue = 0;
      dimensions?.forEach((dimension: any, index: number) => {
        maxValue = Math.max(maxValue, legendRowsData[index]?.data.max ?? 0);
      });
      if (maxValue === 0) {
        return;
      }
      const unit = generateUnitByBaseUnit(maxValue, props.unit);
      setCurrentUnit(unit);
      dimensions.forEach((dimension: any, index: number) => {
        legendRowsData[index].format = (value: number) =>
          formatToolTip(value, props.unit);
      });
    };

    const handleZoomToggle = React.useCallback((zoomInValue: boolean) => {
      if (props.savePref) {
        updateWidgetPreference(props.widget.label, {
          [SIZE]: zoomInValue ? 12 : 6,
        });
      }
      setWidget((widget) => {
        return { ...widget, size: zoomInValue ? 12 : 6 };
      });
    }, []);

    const handleAggregateFunctionChange = React.useCallback(
      (aggregateValue: string) => {
        if (props.savePref) {
          updateWidgetPreference(widget.label, {
            [AGGREGATE_FUNCTION]: aggregateValue,
          });
        }

        setWidget((currentWidget) => {
          return {
            ...currentWidget,
            aggregate_function: aggregateValue,
          };
        });
      },
      []
    );

    const handleIntervalChange = React.useCallback(
      (intervalValue: TimeGranularity) => {
        if (props.savePref) {
          updateWidgetPreference(widget.label, {
            [TIME_GRANULARITY]: { ...intervalValue },
          });
        }
        setWidget((currentWidget) => {
          return {
            ...currentWidget,
            time_granularity: { ...intervalValue },
          };
        });
        // setSelectedInterval({ ...intervalValue });
      },
      []
    );

    const handleFilterChange = (widgetFilter: Filters[]) => {
      // todo, add implementation once component is ready
    };

    const handleGroupByChange = (groupby: string) => {
      // todo, add implememtation once component is ready
    };

    const handleGranularityChange = (step: string) => {
      // todo, add implementation once component is ready
    };
    React.useEffect(() => {
      if (!props.savePref) {
        return;
      }
      const widgets = fetchUserPrefObject()?.widgets;
      const availableWidget = !widgets ? undefined : widgets[widget.label];
      if (!availableWidget) {
        updateWidgetPreference(widget.label, {
          [AGGREGATE_FUNCTION]: widget.aggregate_function,
          [SIZE]: widget.size,
          [TIME_GRANULARITY]: widget.time_granularity,
        });
      }
    }, []);

    return (
      // <Grid
      //   sx={{
      //     alignItems: 'center',
      //     columnGap: 0.2,
      //     direction: 'column',
      //     flexWrap: 'nowrap',
      //   }}
      //   container
      //   lg={widget.size}
      //   xs={6}
      // >
      <Grid xs={widget.size}>
        <Paper
          style={{
            border: 'solid 1px #e3e5e8',
            height: '98%',
            marginTop: '10px',
            width: '100%',
          }}
        >
          {/* add further components like group by resource, aggregate_function, step here , for sample added zoom icon here*/}
          <div className={widget.metric} style={{ margin: '1%' }}>
            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                width: '100%',
              }}
            >
              <Grid sx={{ marginRight: 'auto' }}>
                <Typography className={classes.title}>
                  {convertStringToCamelCasesWithSpaces(`${props.widget.label}`)}{' '}
                  {(!isLoading || !isBitsOrBytes) && `(${currentUnit})`}{' '}
                  {/* show the units of bytes data only when complete data is loaded */}
                </Typography>
              </Grid>
              <Grid sx={{ marginRight: 5, width: 100 }}>
                {props.availableMetrics?.scrape_interval && (
                  <IntervalSelectComponent
                    default_interval={widget?.time_granularity}
                    onIntervalChange={handleIntervalChange}
                    scrape_interval={props.availableMetrics.scrape_interval}
                  />
                )}
              </Grid>
              <Grid sx={{ marginRight: 5, width: 100 }}>
                {props.availableMetrics?.available_aggregate_functions &&
                  props.availableMetrics.available_aggregate_functions.length >
                    0 && (
                    <AggregateFunctionComponent
                      available_aggregate_func={
                        props.availableMetrics?.available_aggregate_functions
                      }
                      default_aggregate_func={widget?.aggregate_function}
                      onAggregateFuncChange={handleAggregateFunctionChange}
                    />
                  )}
              </Grid>
              <Grid
                sx={{
                  marginLeft: 1,
                  marginTop: 1.5,
                }}
                // lg="auto" // }}
                // xs="auto"
              >
                <ZoomIcon
                  handleZoomToggle={handleZoomToggle}
                  zoomIn={widget?.size == 12 ? true : false}
                />
              </Grid>
              {/* </Grid> */}
            </div>
            <Divider spacingBottom={32} spacingTop={15} />
            {!(
              isLoading ||
              (status == 'error' &&
                error &&
                error.length > 0 &&
                error[0].reason == jweTokenExpiryError)
            ) && (
              <CloudViewLineGraph // rename where we have cloudview to cloudpulse
                error={
                  status == 'error'
                    ? error && error.length > 0
                      ? error[0].reason
                      : 'Error while rendering widget'
                    : undefined
                }
                formatData={
                  isBitsOrBytes
                    ? (data: number) =>
                        convertValueToUnit(data, currentUnit, props.unit)
                    : undefined
                }
                formatTooltip={
                  isBitsOrBytes
                    ? (value: number) => formatToolTip(value, props.unit)
                    : undefined
                }
                legendRows={
                  legendRows && legendRows.length > 0 ? legendRows : undefined
                }
                ariaLabel={props.ariaLabel ? props.ariaLabel : ''}
                data={data}
                gridSize={widget.size}
                loading={isLoading}
                nativeLegend={true}
                showToday={today}
                timezone={timezone}
                title={''}
                unit={!isBitsOrBytes ? ` ${currentUnit}` : undefined}
              />
            )}
            {(isLoading ||
              (status == 'error' &&
                error &&
                error.length > 0 &&
                error[0].reason == jweTokenExpiryError)) && <CircleProgress />}
          </div>
        </Paper>
      </Grid>
    );
  }
);
