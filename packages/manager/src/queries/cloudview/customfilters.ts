import { getFilters } from "@linode/api-v4";
import { useQuery } from "@tanstack/react-query"
import { CloudPulseServiceTypeFiltersOptions } from "src/featureFlags";

export const useGetCustomFiltersQuery = (url: string, 
    enabled: boolean, queryKey: string // the query will cache the results, this control is here given to the caller
    , idField: string, labelField: string
) => {
    return useQuery<any, unknown, CloudPulseServiceTypeFiltersOptions[]>( // receive any array return id and label
        [queryKey],
        () => getFilters(url),
        {
            enabled: enabled,
            select : (filters) => { // whatever field we receive, just return id and label
                return filters.data.map((filter:any) => {
                    return {
                        id : filter[idField],
                        label: filter[labelField],
                    }
                })
            }
        }
    )
}