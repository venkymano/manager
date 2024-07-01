import { getFilters } from "@linode/api-v4";
import { useQuery } from "@tanstack/react-query"
import { CloudPulseServiceTypeFiltersOptions } from "src/featureFlags";

export const useGetCustomFiltersQuery = (url: string, 
    enabled: boolean, queryKey: string // the query will cache the results, this control is here given to the caller
) => {
    return useQuery<any[], unknown, CloudPulseServiceTypeFiltersOptions[]>(
        [queryKey],
        () => getFilters(url),
        {
            enabled: enabled,
            select : (data) => { // whatever field we receive, just return id and label
                return data.map(filter => {
                    return {
                        id : filter.id,
                        label: filter.label,
                    }
                })
            }
        }
    )
}