import { Box, CircleProgress } from '@linode/ui';
import { Grid } from '@mui/material';
import React from 'react';

import { DebouncedSearchTextField } from 'src/components/DebouncedSearchTextField';
import { ErrorState } from 'src/components/ErrorState/ErrorState';
import { Typography } from 'src/components/Typography';
import { useResourcesQuery } from 'src/queries/cloudpulse/resources';
import { useRegionsQuery } from 'src/queries/regions/regions';

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

  const {
    data: regions,
    isError: isRegionsError,
    isFetching: isRegionsFetching,
  } = useRegionsQuery();
  const regionsIdToLabelMap: Map<string, Region> = React.useMemo(() => {
    if (!regions) {
      return new Map();
    }

    return new Map(regions.map((region) => [region.id, region]));
  }, [regions]);

  /**
   * The constant holds the resources that are
   * filtered based on the passed resourceIds, typed searchText and filtered regions
   */
  const filteredResources = React.useMemo(() => {
    if (isSelectionsNeeded) {
      return data;
    }

    return data
      ?.filter((resource) => resourceIds.includes(String(resource.id)))
      .filter((resource) => {
        if (searchText) {
          const regionLabel =
            regionsIdToLabelMap.get(resource.region ?? '')?.label ?? '';
          return (
            regionLabel.includes(searchText) ||
            resource.label.includes(searchText)
          );
        }
        return true;
      })
      .filter((resource) => {
        if (filteredRegions) {
          return filteredRegions.includes(resource.region ?? '');
        }
        return true;
      })
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [
    data,
    resourceIds,
    searchText,
    filteredRegions,
    regionsIdToLabelMap,
    isSelectionsNeeded,
  ]);

  /**
   * The constant holds the regions associated with the resources from list of regions
   */
  const regionOptions: Region[] = React.useMemo(() => {
    return Array.from(
      new Set(
        data
          ?.filter((resource) => resourceIds.includes(String(resource.id)))
          ?.map((resource) => {
            const regionId = resource.region;
            return regionId ? regionsIdToLabelMap.get(regionId) : null;
          })
      )
    ).filter(
      (region): region is Region => region !== null && region !== undefined
    );
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
        <Grid container gap={1}>
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

          <Grid item xs={12}>
            {/* Pass filtered data */}
            <DisplayAlertResources
              filteredResources={filteredResources?.map((resource) => {
                return {
                  ...resource,
                  region:
                    regionsIdToLabelMap.get(resource.region ?? '')?.label ||
                    resource.label, // Ensure fallback to original label
                };
              })}
              pageSize={pageSize}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
});
