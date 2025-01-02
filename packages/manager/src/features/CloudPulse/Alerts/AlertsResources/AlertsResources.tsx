import { Box, CircleProgress } from '@linode/ui';
import { Grid, styled, useTheme } from '@mui/material';
import React from 'react';

import EntityIcon from 'src/assets/icons/entityIcons/alert.svg';
import { Checkbox } from 'src/components/Checkbox';
import { DebouncedSearchTextField } from 'src/components/DebouncedSearchTextField';
import { Placeholder } from 'src/components/Placeholder/Placeholder';
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
  /**
   * The label of the alert
   */
  alertLabel?: string;
  /**
   * Callback for publishing the selected resources
   */
  handleResourcesSelection?: (resources: number[]) => void;
  /**
   * This controls whether we need to show the checkbox in case of editing the resources
   */
  isSelectionsNeeded?: boolean;

  /**
   * The set of resource ids to be displayed
   */
  resourceIds: string[];

  /**
   * The service type associated with the alerts like dbaas, linode etc.,
   */
  serviceType: string;
}

export const AlertResources = React.memo((props: AlertResourcesProp) => {
  const {
    alertLabel,
    handleResourcesSelection,
    isSelectionsNeeded = false,
    resourceIds,
    serviceType,
  } = props;

  const [searchText, setSearchText] = React.useState<string>();

  const [filteredRegions, setFilteredRegions] = React.useState<string[]>();
  const pageSize = 25;

  const { data, isError, isFetching } = useResourcesQuery(
    Boolean(serviceType),
    serviceType,
    {},
    serviceType === 'dbaas' ? { platform: 'rdbms-default' } : {}
  );

  const [selectedResources, setSelectedResources] = React.useState<number[]>(
    []
  );

  const [selectedOnly, setSelectedOnly] = React.useState<boolean>(false);

  const theme = useTheme();

  const {
    data: regions,
    isError: isRegionsError,
    isFetching: isRegionsFetching,
  } = useRegionsQuery();

  React.useEffect(() => {
    if (data && isSelectionsNeeded) {
      setSelectedResources(
        data
          .filter((resource) => resourceIds.includes(String(resource.id)))
          .map((resource) => Number(resource.id))
      );
    }
  }, [data, isSelectionsNeeded, resourceIds]);

  React.useEffect(() => {
    if (handleResourcesSelection) {
      handleResourcesSelection(selectedResources);
    }
  }, [selectedResources, handleResourcesSelection]);

  const handleSelection = React.useCallback(
    (ids: number[], isSelectionAction: boolean) => {
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
      isAdditionOrDeletionNeeded: isSelectionsNeeded,
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
    isSelectionsNeeded,
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
      setSelectedResources([...data.map((resource) => Number(resource.id))]);
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

  const titleRef = React.useRef<HTMLDivElement>(null); // when the page size, page number of table changes lets scroll until the title of this component

  if (isFetching || isRegionsFetching) {
    return <CircleProgress />;
  }

  const scrollToTitle = () => {
    if (titleRef.current) {
      window.scrollTo({
        behavior: 'smooth',
        top: titleRef.current.getBoundingClientRect().top + window.scrollY - 40, // Adjust offset if needed
      });
    }
  };

  return (
    <React.Fragment>
      <Typography
        fontSize={theme.spacing(2.25)}
        marginBottom={2}
        ref={titleRef}
        variant="h2"
      >
        {isSelectionsNeeded && alertLabel ? alertLabel : 'Resources'}
      </Typography>
      {!isError && isRegionsError && resourceIds.length === 0 && (
        <StyledPlaceholder
          title={
            'No resources are currently assigned to this alert definition.'
          }
          icon={EntityIcon}
          subtitle="You can assign alerts during the resource creation process."
        />
      )}

      <Grid container spacing={3}>
        {isSelectionsNeeded && (
          <Grid item xs={12}>
            <Typography fontSize="16px" variant="body1">
              You can enable/disable alerts for resources you have access to.
              Some resources linked to this definition may be hidden due to your
              access restrictions.
            </Typography>
          </Grid>
        )}
        <Box columnGap={3} display="flex" flexDirection="row" ml={3} mt={3}>
          <Box columnGap={1} display={'flex'} flexDirection={'row'}>
            <DebouncedSearchTextField
              onSearch={(value) => {
                setSearchText(value);
              }}
              sx={{
                maxHeight: theme.spacing(4.25),
                p: 0,
                width: theme.spacing(37.5),
              }}
              clearable
              debounceTime={300}
              hideLabel
              isSearching={false}
              label="Search for resource"
              placeholder="Search for a Resource or a Region"
              value={searchText ?? ''}
            />
            <AlertsRegionFilter
              handleSelectionChange={(value) => {
                setFilteredRegions(value);
              }}
              regionOptions={regionOptions ?? []}
            />
          </Box>
          {isSelectionsNeeded && (
            <Checkbox
              sx={{
                maxHeight: theme.spacing(4.25),
                pt: theme.spacing(1),
                svg: {
                  backgroundColor: theme.color.white,
                },
              }}
              checked={selectedOnly}
              data-testid="show_selected_only"
              disabled={!(Boolean(selectedResources.length) || selectedOnly)}
              onClick={() => setSelectedOnly(!selectedOnly)}
              text={'Show Selected Only'}
              value={'Show Selected'}
            />
          )}
        </Box>

        {isSelectionsNeeded && !(isError || isRegionsError) && (
          <Grid item xs={12}>
            <AlertsResourcesNotice
              handleSelectionChange={handleAllSelection}
              selectedResources={selectedResources.length}
              totalResources={data?.length ?? 0}
            />
          </Grid>
        )}

        <Grid container item rowGap={3} xs={12}>
          {/* Pass filtered data */}
          <Grid item xs={12}>
            <DisplayAlertResources
              noDataText={
                !(isError || isRegionsError) &&
                !Boolean(filteredResources?.length)
                  ? 'No data to display.'
                  : undefined
              }
              errorText={'Table data is unavailable. Please try again later'}
              filteredResources={filteredResources}
              handleSelection={isSelectionsNeeded ? handleSelection : undefined}
              isDataLoadingError={isError || isRegionsError}
              isSelectionsNeeded={isSelectionsNeeded}
              pageSize={pageSize}
              scrollToTitle={scrollToTitle}
            />
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
});

export const StyledPlaceholder = styled(Placeholder, {
  label: 'StyledPlaceholder',
})(({ theme }) => ({
  h1: {
    fontSize: '20px',
  },
  h2: {
    fontSize: '16px',
  },
  svg: {
    color: 'lightgreen',
    maxHeight: theme.spacing(10.5),
  },
}));
