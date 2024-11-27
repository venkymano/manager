import type { CloudPulseResources } from '../../shared/CloudPulseResourcesSelect';
import type { AlertInstances } from '../AlertsResources/DisplayAlertResource';
import type { Region } from '@linode/api-v4';

interface FilterResourceProps {
    /*
     * The data to be filtered
     */
    data?: CloudPulseResources[];
    /*
     * The selected regions on which the data needs to be filtered
     */
    filteredRegions?: string[];
    /*
     * The map that holds the id of the region to Region object, helps in building the alert resources
     */
    regionsIdToLabelMap: Map<string, Region>;
    /*
     * The resources associated with the alerts
     */
    resourceIds: string[];
    /*
     * The search text with which the resources needed to be filtered
     */
    searchText?: string;
    selectedOnly?: boolean;

    /*
     * This property helps to be track the list of selected resources
     */
    selectedResources?: string[];
}

/**
 * @param regions The list of regions
 * @returns A map of region id to Region object
 */
export const getRegionsIdLabelMap = (
    regions: Region[] | undefined
): Map<string, Region> => {
    if (!regions) {
        return new Map();
    }

    return new Map(regions.map((region) => [region.id, region]));
};

/**
 *
 * @param filterProps
 * @returns
 */
export const getFilteredResources = (
    filterProps: FilterResourceProps
): AlertInstances[] | undefined => {
    const {
        data,
        filteredRegions,
        regionsIdToLabelMap,
        resourceIds,
        searchText,
        selectedOnly = false,
        selectedResources,
    } = filterProps;
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
        .map((resource) => {
            return {
                ...resource,
                checked: selectedResources
                    ? selectedResources.includes(resource.id)
                    : false, // check for selections and drive the resources
                region:
                    regionsIdToLabelMap.get(resource.region ?? '')?.label ||
                    resource.label, // Ensure fallback to original label
            };
        })
        .filter((resource) => (selectedOnly ? resource.checked : true));
};

/**
 * @param filterProps The props required to get the region options and the filtered resources
 * @returns Array of unique regions associated with the resource ids of the alert
 */
export const getRegionOptions = (
    filterProps: FilterResourceProps
): Region[] => {
    const { data, regionsIdToLabelMap, resourceIds } = filterProps;
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
};
