/* eslint-disable no-console */
import { Dashboard, TimeDuration } from '@linode/api-v4';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import * as React from 'react';

import Reload from 'src/assets/icons/reload.svg';

import {
  FiltersObject,
  GlobalFilterProperties,
} from '../Models/GlobalFilterProperties';
import { CloudViewDashboardSelect } from '../shared/DashboardSelect';
import { CloudViewRegionSelect } from '../shared/RegionSelect';
import { CloudViewMultiResourceSelect } from '../shared/ResourceMultiSelect';
import { CloudPulseTimeRangeSelect } from '../shared/TimeRangeSelect';
import {
  REFRESH,
  REGION,
  RESOURCES,
  TIME_DURATION,
} from '../Utils/CloudPulseConstants';
import { updateGlobalFilterPreference } from '../Utils/UserPreference';
import { useFlags } from 'src/hooks/useFlags';
import { CircleProgress } from 'src/components/CircleProgress';
import { CloudPulseServiceTypeFilterMap, CloudPulseServiceTypeFilters, CloudPulseServiceTypeFiltersConfiguration } from 'src/featureFlags';
import { CloudPulseCustomSelect, CloudPulseSelectTypes } from '../shared/CloudPulseCustomSelect';

export const GlobalFilters = React.memo((props: GlobalFilterProperties) => {


  const flags = useFlags(); // flags for rendering dynamic global filters

  const emitGlobalFilterChange = (updatedData: any, changedFilter: string) => {
    props.handleAnyFilterChange(updatedData, changedFilter);
  };

  const [selectedDashboard, setSelectedDashboard] = React.useState<
    Dashboard | undefined
  >();

  const [selectedRegion, setSelectedRegion] = React.useState<
    string | undefined
  >();

  const handleTimeRangeChange = React.useCallback(
    (
      start: number,
      end: number,
      timeDuration?: TimeDuration,
      timeRangeLabel?: string
    ) => {
      if (start > 0 && end > 0) {
        const filterObj = {} as FiltersObject;
        filterObj.timeRange = { end, start };
        filterObj.duration = timeDuration;
        filterObj.durationLabel = timeRangeLabel!;
        emitGlobalFilterChange(filterObj.duration, TIME_DURATION);
        updateGlobalFilterPreference({
          [TIME_DURATION]: filterObj.durationLabel,
        });
      }
    },
    []
  );

  const handleRegionChange = React.useCallback((region: string | undefined) => {
    if (region && region === selectedRegion) {
      return;
    }
    setSelectedRegion(region);
    emitGlobalFilterChange(region, REGION);
  }, []);

  const handleResourceChange = React.useCallback((resourceId: any[]) => {
    emitGlobalFilterChange(resourceId?.map((obj) => obj.id) ?? [], RESOURCES);
  }, []);

  const handleDashboardChange = React.useCallback(
    (dashboard: Dashboard | undefined) => {
      if (dashboard && selectedDashboard?.id === dashboard.id) {
        return;
      }
      setSelectedDashboard(dashboard);

      props.handleDashboardChange(dashboard);
    },
    []
  );

  const handleGlobalRefresh = React.useCallback(() => {
    emitGlobalFilterChange(Date.now(), REFRESH);
  }, []);

  const handleCustomSelectChange = React.useCallback((filterType: string, filterLabel: string) => {
      // handle any custom select change here
  }, []);

  const mockFilter = ():CloudPulseServiceTypeFilterMap[] => {
    let linodeServiceTypeMap : CloudPulseServiceTypeFilterMap[] = [];
    
    let linodeFilterMap : CloudPulseServiceTypeFilterMap = {} as CloudPulseServiceTypeFilterMap;
    linodeFilterMap.serviceType = 'linode';

    let filter: CloudPulseServiceTypeFilters = {} as CloudPulseServiceTypeFilters;
    filter.configuration = {} as CloudPulseServiceTypeFiltersConfiguration;
    filter.name = 'Region'
    filter.configuration.componentKey = 'Select Region'
    filter.configuration.filterKey = 'region'
    filter.configuration.filterLabel = 'Region'
    filter.configuration.filterType = 'string';
    filter.configuration.type = CloudPulseSelectTypes.static;
    filter.configuration.options = [{
        id:"1",
        label:"US-EAST"
    }, {
        id:"2",
        label:"US-WEST"
    }, {
        id:"3",
        label:"IND-MUM"
    }]
    filter.configuration.placeholder = 'Select Region'
    filter.configuration.isMultiSelect = true;
    linodeFilterMap.filters = [];
    linodeFilterMap.filters.push(filter);

    linodeServiceTypeMap.push(linodeFilterMap);


    return linodeServiceTypeMap;
  }

  const FormFilterComponentsByFlags = () => {

      flags.aclpServiceTypeFiltersMap = mockFilter();
      if(flags.aclpServiceTypeFiltersMap) {
        // let aclpServiceTypeFiltersMap: CloudPulseServiceTypeFilterMap[] = [...flags.aclpServiceTypeFiltersMap];
        let aclpServiceTypeFiltersMap: CloudPulseServiceTypeFilterMap[] = mockFilter();

        //process the map to build custom select dropdown
        let filterMap = aclpServiceTypeFiltersMap[0];

        if(filterMap) {
          return (filterMap.filters.map((filter, index) => {

            return (<Grid sx={{ marginLeft: 1, width: 150 }}>
              <CloudPulseCustomSelect
              filterKey={filter.configuration.filterType}
              filterType={filter.configuration.filterKey}
              handleSelectionChange={handleCustomSelectChange}
              type={filter.configuration.type}
              isMultiSelect = {filter.configuration.isMultiSelect}              
              placeholder={filter.configuration.placeholder ? 
                filter.configuration.placeholder : 'Select Value'
              }
              options={filter.configuration.options}
              />
              </Grid>);

          }));
        } else {
          return (<React.Fragment key={'empty'}></React.Fragment>)
        }
      }
      
      return (<React.Fragment key={'empty'}></React.Fragment>)


  }

  if(!flags) {
    return (
      <CircleProgress/> // untill flags gets loaded, show circle progress
    )
  }
  return (
    // <Grid container sx={{ ...itemSpacing, padding: '8px' }}>
      <StyledGrid container xs={12}>
        <Grid sx={{marginLeft:2, width: 300}}>
          <CloudViewDashboardSelect
            handleDashboardChange={handleDashboardChange}
          />
        </Grid>
        <Grid sx={{width: 200}}>
          <CloudViewRegionSelect
            handleRegionChange={handleRegionChange}
            selectedDashboard={selectedDashboard}
          />
        </Grid>
        <Grid sx={{width: 400}}>
          <CloudViewMultiResourceSelect
            disabled={!selectedRegion || !selectedDashboard?.service_type}
            handleResourceChange={handleResourceChange}
            region={selectedRegion}
            resourceType={selectedDashboard?.service_type}
          />
        </Grid>
        <Grid sx={{width: 200}}>
          <CloudPulseTimeRangeSelect
            handleStatsChange={handleTimeRangeChange}
            hideLabel
            label="Select Time Range"
          />
        </Grid>
        {/* { flags.aclpServiceTypeFiltersMap && flags.aclpServiceTypeFiltersMap.length> 0  && 
        (<FormFilterComponentsByFlags/>)} */}
        <FormFilterComponentsByFlags/>

        <Grid sx={{ marginLeft: 1, marginRight: 3 }}>
          <StyledReload onClick={handleGlobalRefresh} />
        </Grid>
      </StyledGrid>
    // </Grid>
  );
});

const StyledGrid = styled(Grid, { label: 'StyledGrid' })(({ theme }) => ({
  alignItems: 'end',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'start',
  gap: 5,
  // flexWrap:'nowrap',
  marginBottom: theme.spacing(1.25),  
}));

const itemSpacing = {
  boxSizing: 'border-box',
  margin: '0',
};

const StyledReload = styled(Reload, { label: 'StyledReload' })(({ theme }) => ({
  '&:active': {
    color: 'green',
  },
  '&:hover': {
    cursor: 'pointer',
  },
  height: '27px',
  width: '27px',
}));