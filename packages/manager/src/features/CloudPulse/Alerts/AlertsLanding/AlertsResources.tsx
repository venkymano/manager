import { Box, CircleProgress, Notice, Paper } from '@linode/ui';
import { Grid } from '@mui/material';
import React from 'react';

import { DebouncedSearchTextField } from 'src/components/DebouncedSearchTextField';
import { DismissibleBanner } from 'src/components/DismissibleBanner/DismissibleBanner';
import { StyledNotice } from 'src/components/DismissibleBanner/DismissibleBanner.styles';
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
      selectedResources,
    });
  }, [
    data,
    resourceIds,
    searchText,
    filteredRegions,
    regionsIdToLabelMap,
    selectedResources,
  ]);

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
    <Box
      sx={(theme) => ({
        backgroundColor:
          theme.name === 'light' ? theme.color.grey5 : theme.color.grey9,
        borderRadius: 1,
        minHeight: 'inherit',
      })}
      p={3}
    >
      <Typography gutterBottom marginBottom={2} variant="h2">
        Resources
      </Typography>
      {resourceIds.length === 0 && (
        <Typography textAlign={'center'} variant="h2">
          No Resources to display
        </Typography>
      )}

      {resourceIds.length > 0 && (
        <Grid container gap={2}>
          <Grid item md={4} xs={12}>
            <DebouncedSearchTextField
              onSearch={(value) => {
                setSearchText(value);
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

          <Grid item md={6} xs={12}>
            <StyledNotice
              style={{
                backgroundColor: 'white',
              }}
              variant="info"
            >
              {selectedResources.length} out of {data?.length} selected
            </StyledNotice>
          </Grid>

          <Grid item marginTop={-1} xs={12}>
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
    </Box>
  );
});
