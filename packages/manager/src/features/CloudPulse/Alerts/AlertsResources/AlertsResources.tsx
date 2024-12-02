import { CircleProgress } from '@linode/ui';
import { Grid, useTheme } from '@mui/material';
import React from 'react';

import { Checkbox } from 'src/components/Checkbox';
import { DebouncedSearchTextField } from 'src/components/DebouncedSearchTextField';
import { ErrorState } from 'src/components/ErrorState/ErrorState';
import { Typography } from 'src/components/Typography';
import { useResourcesQuery } from 'src/queries/cloudpulse/resources';
import { useRegionsQuery } from 'src/queries/regions/regions';

import {
  getFilteredResources,
  getRegionOptions,
  getRegionsIdLabelMap,
} from '../Utils/AlertResourceUtils';
import { AlertsRegionFilter } from './AlertsRegionFilter';
import { AlertsResourcesNotice } from './AlertsResourcesNotice';
import { DisplayAlertResources } from './DisplayAlertResource';

import type { Region } from '@linode/api-v4';

export interface AlertResourcesProp {
  /*
   * This controls whether we need to show the checkbox in case of editing the resources
   */
  isSelectionsNeeded?: boolean;
  /*
   * The set of resource ids to be displayed
   */
  resourceIds: string[];
  /*
   * The service type associated with the alerts like dbaas, linode etc.,
   */
  serviceType: string;
}

export const AlertResources = React.memo((props: AlertResourcesProp) => {
  const { isSelectionsNeeded = false, resourceIds, serviceType } = props;

  const [searchText, setSearchText] = React.useState<string>();

  const [filteredRegions, setFilteredRegions] = React.useState<string[]>();
  const pageSize = 25;

  const { data, isError, isFetching } = useResourcesQuery(
    Boolean(serviceType),
    serviceType,
    {},
    {}
  );

  const [selectedResources, setSelectedResources] = React.useState<string[]>(
    []
  );

  const [selectedOnly, setSelectedOnly] = React.useState<boolean>(false);

  const theme = useTheme();

  const {
    data: regions,
    isError: isRegionsError,
    isFetching: isRegionsFetching,
  } = useRegionsQuery();

  const handleSelection = React.useCallback(
    (ids: string[], isSelectionAction: boolean) => {
      const onlySelected = isSelectionAction
        ? selectedResources
        : selectedResources.filter((resource) => !ids.includes(resource));

      const newlySelected = ids.filter((id) => !selectedResources.includes(id));

      setSelectedResources([...onlySelected, ...newlySelected]);
    },
    [selectedResources]
  );

  // The map holds the id of the region to the entire region object that needs to be displayed in table
  const regionsIdToLabelMap: Map<string, Region> = React.useMemo(() => {
    return getRegionsIdLabelMap(regions);
  }, [regions]);

  /**
   * Holds the resources that are
   * filtered based on the passed resourceIds, typed searchText and filtered regions
   */
  const filteredResources = React.useMemo(() => {
    return getFilteredResources({
      data,
      filteredRegions,
      regionsIdToLabelMap,
      resourceIds,
      searchText,
      selectedOnly,
      selectedResources,
    });
  }, [
    data,
    resourceIds,
    searchText,
    filteredRegions,
    regionsIdToLabelMap,
    selectedResources,
    selectedOnly,
  ]);

  const handleAllSelection = React.useCallback(() => {
    if (!data) {
      // Guard clause if data is undefined
      return;
    }

    if (selectedResources.length === data.length) {
      // Unselect all
      setSelectedResources([]);
    } else {
      // Select all
      setSelectedResources([...data.map((resource) => resource.id)]);
    }
  }, [data, selectedResources]);

  /**
   * Holds the regions associated with the resources from list of regions
   */
  const regionOptions: Region[] = React.useMemo(() => {
    return getRegionOptions({
      data,
      regionsIdToLabelMap,
      resourceIds,
    });
  }, [data, resourceIds, regionsIdToLabelMap]);

  if (isFetching || isRegionsFetching) {
    return <CircleProgress />;
  }

  if (isError || isRegionsError) {
    return <ErrorState errorText={'Error loading resources'} />;
  }

  return (
    <React.Fragment>
      <Typography
        fontSize={theme.spacing(2.25)}
        gutterBottom
        marginBottom={2}
        variant="h2"
      >
        Resources
      </Typography>
      {resourceIds.length === 0 && (
        <Typography textAlign={'center'} variant="h2">
          No Resources to display
        </Typography>
      )}

      {resourceIds.length > 0 && (
        <Grid container spacing={3} xs={12}>
          <Grid columnSpacing={1} container item rowSpacing={3} xs={12}>
            <Grid item lg={4} xs={12}>
              <DebouncedSearchTextField
                onSearch={(value) => {
                  setSearchText(value);
                }}
                sx={{
                  maxHeight: theme.spacing(4.25),
                }}
                debounceTime={300}
                hideLabel
                isSearching={false}
                label="Search for resource"
                placeholder="Search for resource"
                value={searchText ?? ''}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <AlertsRegionFilter
                handleSelectionChange={(value) => {
                  setFilteredRegions(value);
                }}
                regionOptions={regionOptions ?? []}
              />
            </Grid>
            {isSelectionsNeeded && (
              <Grid item lg={4} xs={12}>
                <Checkbox
                  sx={{
                    maxHeight: theme.spacing(4.25),
                    pt: theme.spacing(1),
                  }}
                  checked={selectedOnly}
                  onClick={() => setSelectedOnly(!selectedOnly)}
                  text={'Show Selected Only'}
                  value={'Show Selected'}
                />
              </Grid>
            )}
          </Grid>

          {isSelectionsNeeded && (
            <Grid item xs={12}>
              <AlertsResourcesNotice
                handleSelectionChange={handleAllSelection}
                selectedResources={selectedResources.length}
                totalResources={data?.length ?? 0}
              />
            </Grid>
          )}

          <Grid item xs={12}>
            {/* Pass filtered data */}
            <DisplayAlertResources
              filteredResources={filteredResources}
              handleSelection={isSelectionsNeeded ? handleSelection : undefined}
              isSelectionsNeeded={isSelectionsNeeded}
              pageSize={pageSize}
            />
          </Grid>
        </Grid>
      )}
    </React.Fragment>
  );
});
