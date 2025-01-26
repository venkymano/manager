import { Checkbox, CircleProgress, Stack, Typography } from '@linode/ui';
import { Grid, useTheme } from '@mui/material';
import React from 'react';

import EntityIcon from 'src/assets/icons/entityIcons/alerts.svg';
import { DebouncedSearchTextField } from 'src/components/DebouncedSearchTextField';
import { useResourcesQuery } from 'src/queries/cloudpulse/resources';
import { useRegionsQuery } from 'src/queries/regions/regions';

import { StyledPlaceholder } from '../AlertsDetail/AlertDetail';
import {
  getFilteredResources,
  getRegionOptions,
  getRegionsIdRegionMap,
  scrollToElement,
} from '../Utils/AlertResourceUtils';
import { AlertsRegionFilter } from './AlertsRegionFilter';
import { AlertsResourcesNotice } from './AlertsResourcesNotice';
import { DisplayAlertResources } from './DisplayAlertResources';

import type { Region } from '@linode/api-v4';

export interface AlertResourcesProp {
  /**
   * The label of the alert to be displayed
   */
  alertLabel?: string;
  /**
   * The set of resource ids associated with the alerts, that needs to be displayed
   */
  alertResourceIds: string[];

  /**
   * Callback for publishing the selected resources
   */
  handleResourcesSelection?: (resources: string[]) => void;

  /**
   * This controls whether we need to show the checkbox in case of editing the resources
   */
  isSelectionsNeeded?: boolean;

  /**
   * The service type associated with the alerts like DBaaS, Linode etc.,
   */
  serviceType: string;
}

export const AlertResources = React.memo((props: AlertResourcesProp) => {
  const {
    alertLabel,
    alertResourceIds,
    handleResourcesSelection,
    isSelectionsNeeded,
    serviceType,
  } = props;
  const [searchText, setSearchText] = React.useState<string>();
  const [filteredRegions, setFilteredRegions] = React.useState<string[]>();
  const [selectedResources, setSelectedResources] = React.useState<string[]>(
    alertResourceIds
  );

  const [selectedOnly, setSelectedOnly] = React.useState<boolean>(false);
  const pageSize = 25;

  const {
    data: regions,
    isError: isRegionsError,
    isFetching: isRegionsFetching,
  } = useRegionsQuery();

  const {
    data: resources,
    isError: isResourcesError,
    isFetching: isResourcesFetching,
  } = useResourcesQuery(
    Boolean(serviceType),
    serviceType,
    {},
    serviceType === 'dbaas' ? { platform: 'rdbms-default' } : {}
  );

  const theme = useTheme();

  React.useEffect(() => {
    if (resources && isSelectionsNeeded) {
      setSelectedResources(
        resources
          .filter((resource) => alertResourceIds.includes(resource.id))
          .map((resource) => resource.id)
      );
    }
  }, [resources, isSelectionsNeeded, alertResourceIds]);

  const handleSelection = React.useCallback(
    (ids: string[], isSelectionAction: boolean) => {
      const onlySelected = isSelectionAction
        ? selectedResources
        : selectedResources.filter((resource) => !ids.includes(resource));

      const newlySelected = ids.filter((id) => !selectedResources.includes(id));

      setSelectedResources([...onlySelected, ...newlySelected]);

      if (handleResourcesSelection) {
        handleResourcesSelection([...onlySelected, ...newlySelected]);
      }
    },
    [handleResourcesSelection, selectedResources]
  );

  // A map linking region IDs to their corresponding region objects, used for quick lookup when displaying data in the table.
  const regionsIdToRegionMap: Map<string, Region> = React.useMemo(() => {
    return getRegionsIdRegionMap(regions);
  }, [regions]);

  // Derived list of regions associated with the provided resource IDs, filtered based on available data.
  const regionOptions: Region[] = React.useMemo(() => {
    return getRegionOptions({
      data: resources,
      regionsIdToRegionMap,
      resourceIds: alertResourceIds,
    });
  }, [resources, alertResourceIds, regionsIdToRegionMap]);

  /**
   * Holds the resources that are
   * filtered based on the passed resourceIds, typed searchText and filtered regions
   */
  const filteredResources = React.useMemo(() => {
    return getFilteredResources({
      data: resources,
      filteredRegions,
      isAdditionOrDeletionNeeded: isSelectionsNeeded,
      regionsIdToRegionMap,
      resourceIds: alertResourceIds,
      searchText,
      selectedOnly,
      selectedResources,
    });
  }, [
    resources,
    filteredRegions,
    isSelectionsNeeded,
    regionsIdToRegionMap,
    alertResourceIds,
    searchText,
    selectedOnly,
    selectedResources,
  ]);

  const handleAllSelection = React.useCallback(() => {
    if (!resources) {
      // Guard clause if data is undefined
      return;
    }

    if (selectedResources.length === resources.length) {
      // Unselect all
      setSelectedResources([]);
    } else {
      // Select all
      const allResources = resources.map((resource) => resource.id);
      setSelectedResources(allResources);
      if (handleResourcesSelection) {
        handleResourcesSelection(allResources);
      }
    }
  }, [handleResourcesSelection, resources, selectedResources]);

  const isDataLoadingError = isRegionsError || isResourcesError;

  const handleSearchTextChange = (searchText: string) => {
    setSearchText(searchText);
  };

  const handleFilteredRegionsChange = (selectedRegions: string[]) => {
    setFilteredRegions(
      selectedRegions.map(
        (region) =>
          regionsIdToRegionMap.get(region)
            ? `${regionsIdToRegionMap.get(region)?.label} (${region})`
            : region // Stores filtered regions in the format `region.label (region.id)` that is displayed and filtered in the table
      )
    );
  };

  const titleRef = React.useRef<HTMLDivElement>(null); // Reference to the component title, used for scrolling to the title when the table's page size or page number changes.

  if (isResourcesFetching || isRegionsFetching) {
    return <CircleProgress />;
  }

  if (!isDataLoadingError && alertResourceIds.length === 0) {
    return (
      <Stack gap={2}>
        <Typography ref={titleRef} variant="h2">
          {alertLabel || 'Resources'}
          {/* It can be either the passed alert label or just Resources */}
        </Typography>
        <StyledPlaceholder
          icon={EntityIcon}
          subtitle="You can assign alerts during the resource creation process."
          title="No resources are currently assigned to this alert definition."
        />
      </Stack>
    );
  }

  return (
    <Stack gap={2}>
      <Typography ref={titleRef} variant="h2">
        {alertLabel || 'Resources'}
        {/* It can be either the passed alert label or just Resources */}
      </Typography>
      {(isDataLoadingError || alertResourceIds.length) && ( // if there is data loading error display error message with empty table setup
        <Grid container spacing={3}>
          <Grid columnSpacing={1} container item rowSpacing={3} xs={12}>
            <Grid item md={3} xs={12}>
              <DebouncedSearchTextField
                sx={{
                  maxHeight: '34px',
                }}
                clearable
                hideLabel
                label="Search for a Region or Resource"
                onSearch={handleSearchTextChange}
                placeholder="Search for a Region or Resource"
                value={searchText || ''}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <AlertsRegionFilter
                handleSelectionChange={handleFilteredRegionsChange}
                regionOptions={regionOptions}
              />
            </Grid>
            {isSelectionsNeeded && (
              <Grid
                sx={{
                  ml: {
                    md: 2,
                    xs: 0,
                  },
                }}
                item
                md={4}
                xs={12}
              >
                <Checkbox
                  disabled={
                    !(Boolean(selectedResources.length) || selectedOnly)
                  }
                  sx={{
                    maxHeight: '34px',
                    pt: theme.spacing(1.2),
                    svg: {
                      backgroundColor: theme.color.white,
                    },
                  }}
                  checked={selectedOnly}
                  data-testid="show_selected_only"
                  onClick={() => setSelectedOnly(!selectedOnly)}
                  text={'Show Selected Only'}
                  value={'Show Selected'}
                />
              </Grid>
            )}
          </Grid>
          {isSelectionsNeeded && !(isResourcesError || isRegionsError) && (
            <Grid item xs={12}>
              <AlertsResourcesNotice
                handleSelectionChange={handleAllSelection}
                selectedResources={selectedResources.length}
                totalResources={resources?.length ?? 0}
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <DisplayAlertResources
              noDataText={
                !(isResourcesError || isRegionsError) &&
                !Boolean(filteredResources?.length)
                  ? 'No data to display.'
                  : undefined
              }
              errorText={'Table data is unavailable. Please try again later.'}
              filteredResources={filteredResources}
              handleSelection={isSelectionsNeeded ? handleSelection : undefined}
              isDataLoadingError={isResourcesError || isRegionsError}
              isSelectionsNeeded={isSelectionsNeeded}
              pageSize={pageSize}
              regionOptions={regionOptions}
              scrollToElement={() => scrollToElement(titleRef.current)}
            />
          </Grid>
        </Grid>
      )}
    </Stack>
  );
});
