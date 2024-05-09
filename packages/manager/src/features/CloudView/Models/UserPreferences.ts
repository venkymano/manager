export interface AclpPreference {
  aclp_config: AclpConfig;
}

export interface AclpConfig {
  aggregation_interval: string;
  dashboard_id: number;
  region_id: string;
  resources_ids: number[];
  time_duration: string;
  widgets: AclpWidgetPreferences[];
}

export interface AclpWidgetPreferences {
  label: string;
  size: number;
}
