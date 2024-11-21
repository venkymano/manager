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
  isSelectionsNeeded?: boolean;
  resourceIds: string[];
  serviceType: string;
}

export const AlertResources = React.memo((props: AlertResourcesProp) => {
  const { resourceIds, serviceType } = props;

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
  const filteredResources = React.useMemo(() => {
    return data
      ?.filter((resource) => resourceIds.includes(String(resource.id)))
      .filter((resource) =>
        resource && searchText
          ? regionsIdToLabelMap
              .get(resource.region ?? '')
              ?.label.includes(searchText) ||
            resource.label.includes(searchText)
          : resource
      )
      .filter((resource) =>
        resource && filteredRegions
          ? filteredRegions.includes(resource.region ?? '')
          : resource
      )
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [data, resourceIds, searchText, filteredRegions, regionsIdToLabelMap]);

  if (isFetching || isRegionsFetching) {
    return <CircleProgress />;
  }

  if (isError || isRegionsError) {
    return <ErrorState errorText={'Error loading resources'} />;
  }

  const regionOptions: Region[] =
    Array.from(
      new Set(
        data
          ?.filter((resource) => resourceIds.includes(String(resource.id)))
          ?.map((resource) => {
            const regionId = resource.region;
            return regionId ? regionsIdToLabelMap.get(regionId) : null;
          })
          .filter((option) => option !== null && option !== undefined)
      )
    ) ?? [];

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
      {/* Pass filteredResources to OrderBy */}

      <Grid container gap={1}>
        <Grid item md={4} xs={12}>
          <DebouncedSearchTextField
            onSearch={(value) => {
              setSearchText(value);
            }}
            debounceTime={400}
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
            regionOptions={regionOptions} // Ensure no empty options
          />
        </Grid>

        <Grid item xs={12}>
          {/* Pass ordered and filtered data */}
          <DisplayAlertResources
            filteredResources={filteredResources}
            pageSize={pageSize}
            regionsIdToLabelMap={regionsIdToLabelMap}
          />
        </Grid>
      </Grid>
    </Box>
  );
});
