import { Box, CircleProgress } from '@linode/ui';
import { Grid, TableCell } from '@mui/material';
import TableHead from '@mui/material/TableHead/TableHead';
import React from 'react';

import { Checkbox } from 'src/components/Checkbox';
import { DebouncedSearchTextField } from 'src/components/DebouncedSearchTextField';
import { ErrorState } from 'src/components/ErrorState/ErrorState';
import { Table } from 'src/components/Table';
import { TableRow } from 'src/components/TableRow/TableRow';
import { TableSortCell } from 'src/components/TableSortCell';
import { Typography } from 'src/components/Typography';
import { useResourcesQuery } from 'src/queries/cloudpulse/resources';
import { useRegionsQuery } from 'src/queries/regions/regions';

import { AlertsRegionFilter } from './AlertsRegionFilter';

import type { AlertsRegionOption } from './AlertsRegionFilter';
import type { Region } from '@linode/api-v4';

export interface AlertResourcesProp {
  isSelectionsNeeded?: boolean;
  resourceIds: string[];
  serviceType: string;
}

export const AlertResources = React.memo((props: AlertResourcesProp) => {
  const { isSelectionsNeeded = false, resourceIds, serviceType } = props;

  const [searchText, setSearchText] = React.useState<string>();

  const [filteredRegion, setFilteredRegion] = React.useState<string>();

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

  const filteredResources = React.useMemo(() => {
    return data
      ?.filter((resource) => resourceIds.includes(String(resource.id)))
      .filter((resource) =>
        resource && searchText
          ? resource.region?.includes(searchText) ||
            resource.label.includes(searchText)
          : resource
      )
      .filter((resource) =>
        resource && filteredRegion
          ? resource.region === filteredRegion ||
            filteredRegion === 'allRegions'
          : resource
      );
  }, [data, resourceIds, searchText, filteredRegion]);

  const regionsIdToLabelMap: Map<string, Region> = React.useMemo(() => {
    if (!regions) {
      return new Map();
    }

    return new Map(regions.map((region) => [region.id, region]));
  }, [regions]);

  if (isFetching || isRegionsFetching) {
    return <CircleProgress />;
  }

  if (isError || isRegionsError) {
    return <ErrorState errorText={'Error loading resources'} />;
  }

  const regionOptions: AlertsRegionOption[] =
    filteredResources
      ?.map((resource) => {
        const regionId = resource.region;
        const regionData = regionId ? regionsIdToLabelMap.get(regionId) : null;

        return {
          id: regionData?.id || '',
          label: regionData?.label || '',
        };
      })
      .filter((option) => option.id !== '' && option.label !== '') ?? [];

  if (regionOptions.length) {
    regionOptions.unshift({ id: 'allRegions', label: 'All Regions' });
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
      <Grid container gap={1}>
        <Grid item md={3} xs={12}>
          <DebouncedSearchTextField
            // eslint-disable-next-line no-console
            onSearch={(value) => {
              setSearchText(value);
            }}
            debounceTime={400}
            hideLabel
            isSearching={false}
            label="Search for resource"
            placeholder="Search for resource"
            value={''}
          />
        </Grid>
        <Grid item md={3} xs={12}>
          <AlertsRegionFilter
            handleSelectionChange={(value) => {
              setFilteredRegion(value);
            }}
            regionOptions={regionOptions} // Filter out empty options
          />
        </Grid>
      </Grid>
      <Table
        sx={{
          paddingTop: 2,
        }}
      >
        <TableHead>
          <TableRow>
            {isSelectionsNeeded && (
              <TableCell
                style={{
                  padding: '10px',
                }}
              >
                <Checkbox style={{ height: '26px' }}></Checkbox>
              </TableCell>
            )}
            <TableSortCell
              active={true}
              direction="asc"
              handleClick={() => {}}
              label="resources"
            >
              Resources
            </TableSortCell>
            <TableSortCell
              active={false}
              direction="asc"
              handleClick={() => {}}
              label="region"
            >
              Region
            </TableSortCell>
          </TableRow>
        </TableHead>
        {filteredResources?.map((resource) => {
          return (
            <TableRow key={resource.id}>
              {isSelectionsNeeded && (
                <TableCell
                  style={{
                    padding: '10px',
                  }}
                >
                  <Checkbox style={{ height: '26px' }}></Checkbox>
                </TableCell>
              )}
              <TableCell>{resource.label}</TableCell>
              <TableCell>
                {resource.region
                  ? regionsIdToLabelMap.has(resource.region)
                    ? regionsIdToLabelMap.get(resource.region)?.label
                    : resource.region
                  : resource.region}
              </TableCell>
            </TableRow>
          );
        })}
      </Table>
    </Box>
  );
});
