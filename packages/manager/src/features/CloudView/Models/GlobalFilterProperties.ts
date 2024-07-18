import { Dashboard, TimeDuration, TimeGranularity } from '@linode/api-v4';

import { WithStartAndEnd } from 'src/features/Longview/request.types';

export interface GlobalFilterProperties {
  handleAnyFilterChange(filterKey: string, value: any): undefined | void;
  handleDashboardChange(dashboard: Dashboard | undefined): undefined | void;
}

export interface FiltersObject {
  duration?: TimeDuration;
  durationLabel?: string;
  interval?: string;
  region?: string;
  resource: string[];
  serviceType?: string;
  step?: TimeGranularity;
  timeRange?: WithStartAndEnd;
  timestamp?: number | undefined;
}
