import { Grid } from '@mui/material';
import * as React from 'react';
import { CloudPulseServiceTypeFilterMap, CloudPulseServiceTypeFilters, CloudPulseServiceTypeFiltersConfiguration } from 'src/featureFlags';
import { CloudPulseSelectTypes, CloudPulseCustomSelect } from '../shared/CloudPulseCustomSelect';
import { useFlags } from 'src/hooks/useFlags';
import { CircleProgress } from 'src/components/CircleProgress';
import { useCloudViewDashboardByIdQuery } from 'src/queries/cloudview/dashboards';
import { CloudViewMultiResourceSelect } from '../shared/ResourceMultiSelect';

export interface DashboardWithFilterProps {
    dashboardId : number;
}


export const CloudPulseDashboardWithFilters = React.memo((props: DashboardWithFilterProps) => {

    const flags = useFlags(); // flags for rendering dynamic global filters

    const [stateInt, setStateInt] = React.useState(1);

    const {data, status} = useCloudViewDashboardByIdQuery(props.dashboardId, undefined
    )

    
    React.useEffect(() => {
        console.log(status)
    }, [status])



    const mockFilter = ():CloudPulseServiceTypeFilterMap[] => {
        let linodeServiceTypeMap : CloudPulseServiceTypeFilterMap[] = [];
        
        let linodeFilterMap : CloudPulseServiceTypeFilterMap = {} as CloudPulseServiceTypeFilterMap;
        linodeFilterMap.serviceType = 'linode';
        linodeFilterMap.filters = [];
        linodeFilterMap.filters.push(getFilter());
        linodeFilterMap.filters.push(getDynamicTypeFilter());    
        linodeFilterMap.filters.push(getPredefinedFilter())
    
        linodeServiceTypeMap.push(linodeFilterMap);
    
    
        return linodeServiceTypeMap;
      }
    
      const getFilter = () => {
        let filter: CloudPulseServiceTypeFilters = {} as CloudPulseServiceTypeFilters;
        filter.configuration = {} as CloudPulseServiceTypeFiltersConfiguration;
        filter.name = 'Region'
        filter.configuration.name = 'Region'
        filter.configuration.filterKey = 'region'
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
        filter.configuration.isMultiSelect = false;
    
        return filter;
      }
    
      const getDynamicTypeFilter = () => {
        let filter: CloudPulseServiceTypeFilters = {} as CloudPulseServiceTypeFilters;
        filter.configuration = {} as CloudPulseServiceTypeFiltersConfiguration;
        filter.name = 'DB Engine API'
        filter.configuration.filterKey = "dbEngine",
        filter.configuration.type = CloudPulseSelectTypes.dynamic;
        filter.configuration.filterType = "string",
        filter.configuration.apiUrl = "https://blr-lhv95n.bangalore.corp.akamai.com:9000/v4/monitor/services/linode/dashboards";        
        filter.configuration.placeholder = 'Select a Engine'
        filter.configuration.isMetricsFilter = false;
        filter.configuration.isMultiSelect = false;
    
        return filter;
      }

      const getPredefinedFilter = () => {
        let filter: CloudPulseServiceTypeFilters = {} as CloudPulseServiceTypeFilters;
        filter.configuration = {} as CloudPulseServiceTypeFiltersConfiguration;
        filter.name = 'Resources'
        filter.configuration.filterKey = "resource",
        filter.configuration.type = CloudPulseSelectTypes.predefined;
        filter.configuration.filterType = "string",
        filter.configuration.placeholder = 'Select Resources'
        filter.configuration.isMetricsFilter = true;
        return filter;
      }

      const handleResourceChange = React.useCallback((resourceId: any[]) => {
        // emitGlobalFilterChange(resourceId?.map((obj) => obj.id) ?? [], RESOURCES);
      }, []);

      const ResourceSelectionComponent = () => {
        return (<CloudViewMultiResourceSelect 
            disabled={false}
            handleResourceChange={handleResourceChange}
            region={undefined}
            resourceType={data?.service_type}
        />)
      }
    
      const FormFilterComponentsByFlags = () => {
    
          flags.aclpServiceTypeFiltersMap = mockFilter();
          if(flags && data) {
            if(flags.aclpServiceTypeFiltersMap) {
                // let aclpServiceTypeFiltersMap: CloudPulseServiceTypeFilterMap[] = [...flags.aclpServiceTypeFiltersMap];
                let aclpServiceTypeFiltersMap: CloudPulseServiceTypeFilterMap[] = mockFilter();
        
                //process the map to build custom select dropdown
                let filterMap = aclpServiceTypeFiltersMap[0];
        
                if(filterMap) {
                  return (filterMap.filters.map((filter, index) => {
                    
    
                    // like below we will have lot of predefined filters as well
                    if(filter.configuration.type == CloudPulseSelectTypes.predefined && filter.configuration.filterKey == 'resource') {
                        return (<ResourceSelectionComponent/>)
                    }
        
                    return (<Grid sx={{ marginLeft: 2, width: 150 }}>
                      <CloudPulseCustomSelect
                      key={index + '_' + filter.configuration.filterKey}
                      filterKey={filter.configuration.filterType}
                      filterType={filter.configuration.filterKey}
                      handleSelectionChange={handleCustomSelectChange}
                      type={filter.configuration.type}
                      isMultiSelect = {filter.configuration.isMultiSelect ? filter.configuration.isMultiSelect : false}
                      placeholder={filter.configuration.placeholder ? 
                        filter.configuration.placeholder : 'Select Value'
                      }
                      options={filter.configuration.options}
                      dataApiUrl={filter.configuration.apiUrl}
                      apiResponseIdField={filter.configuration.apiIdField ? filter.configuration.apiIdField : 'id'}
                      apiResponseLabelField={filter.configuration.apiLabelField ? filter.configuration.apiLabelField : 'label'}
                      />
                      </Grid>);
        
                  }));
                } else {
                  return (<React.Fragment key={'empty'}></React.Fragment>)
                }
              }
          }
          
          return (<React.Fragment key={'empty'}></React.Fragment>)
    
    
      }   

      const handleCustomSelectChange = React.useCallback((filterType: string, filterLabel: string) => {
        // handle any custom select change here
        console.log(filterType, filterLabel)
    }, []);

        return (
            <><FormFilterComponentsByFlags/></>
            
        )

      
})