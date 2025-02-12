import { aggregationTypeMap, metricOperatorTypeMap } from '../constants';

import type { AlertDimensionsProp } from '../AlertsDetail/DisplayAlertDetailChips';
import type {
  Alert,
  AlertDefinitionMetricCriteria,
  AlertDefinitionType,
  NotificationChannel,
  ServiceTypesList,
} from '@linode/api-v4';
import type { Theme } from '@mui/material';

export interface ProcessedCriteria {
  /**
   * Aggregation type for the metric criteria
   */
  aggregationType: string;
  /**
   * Label for the metric criteria
   */
  label: string;
  /**
   * Comparison operator for the metric criteria
   */
  operator: string;
  /**
   * Threshold value for the metric criteria
   */
  threshold: number;
  /**
   * Unit for the threshold value
   */
  unit: string;
}

interface AlertChipBorderProps {
  /**
   * The radius needed for the border
   */
  borderRadiusPxValue: string;
  /**
   * The index of the chip
   */
  index: number;
  /**
   * The total length of the chips to be build
   */
  length: number;

  /**
   * Indicates Whether to merge the chips into single or keep it individually
   */
  mergeChips: boolean | undefined;
}

/**
 * @param serviceType Service type for which the label needs to be displayed
 * @param serviceTypeList List of available service types in Cloud Pulse
 * @returns The label for the given service type from available service types
 */
export const getServiceTypeLabel = (
  serviceType: string,
  serviceTypeList: ServiceTypesList | undefined
) => {
  if (!serviceTypeList) {
    return serviceType;
  }

  return (
    serviceTypeList.data.find(
      ({ service_type: serviceTypeObj }) => serviceTypeObj === serviceType
    )?.label || serviceType
  );
};

/**
 * @param theme MUI theme object
 * @returns The style object for the box used in alert details page
 */
export const getAlertBoxStyles = (theme: Theme) => ({
  backgroundColor: theme.tokens.background.Neutral,
  padding: theme.spacing(3),
});
/**
 * Converts seconds into a human-readable minutes and seconds format.
 * @param seconds The seconds that need to be converted into minutes.
 * @returns A string representing the time in minutes and seconds.
 */
export const convertSecondsToMinutes = (seconds: number): string => {
  if (seconds <= 0) {
    return '0 minutes';
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const minuteString =
    minutes > 0 ? `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}` : '';
  const secondString =
    remainingSeconds > 0
      ? `${remainingSeconds} ${remainingSeconds === 1 ? 'second' : 'seconds'}`
      : '';
  return [minuteString, secondString].filter(Boolean).join(' and ');
};
/**
 * @param props The props/parameters needed to determine the alert chip's border
 * @returns The border radius to be applied on chips based on the parameters
 */
export const getAlertChipBorderRadius = (
  props: AlertChipBorderProps
): string => {
  const { borderRadiusPxValue, index, length, mergeChips } = props;
  if (!mergeChips || length === 1) {
    return borderRadiusPxValue;
  }
  if (index === 0) {
    return `${borderRadiusPxValue} 0 0 ${borderRadiusPxValue}`;
  }
  if (index === length - 1) {
    return `0 ${borderRadiusPxValue} ${borderRadiusPxValue} 0`;
  }
  return '0';
};

/**
 * @param value The notification channel object for which we need to display the chips
 * @returns The label and the values that needs to be displayed based on channel type
 */
export const getChipLabels = (
  value: NotificationChannel
): AlertDimensionsProp => {
  if (value.channel_type === 'email') {
    return {
      label: 'To',
      values: value.content.email.email_addresses,
    };
  } else if (value.channel_type === 'slack') {
    return {
      label: 'Slack Webhook URL',
      values: [value.content.slack.slack_webhook_url],
    };
  } else if (value.channel_type === 'pagerduty') {
    return {
      label: 'Service API Key',
      values: [value.content.pagerduty.service_api_key],
    };
  } else {
    return {
      label: 'Webhook URL',
      values: [value.content.webhook.webhook_url],
    };
  }
};

/**
 *
 * @param criterias list of metric criterias to be processed
 * @returns list of metric criterias in processed form
 */
export const processMetricCriteria = (
  criterias: AlertDefinitionMetricCriteria[]
): ProcessedCriteria[] => {
  return criterias
    .map((criteria) => {
      const { aggregate_function, label, operator, threshold, unit } = criteria;
      return {
        aggregationType: aggregationTypeMap[aggregate_function],
        label,
        operator: metricOperatorTypeMap[operator],
        threshold,
        unit,
      };
    })
    .reduce<ProcessedCriteria[]>((previousValue, currentValue) => {
      previousValue.push(currentValue);
      return previousValue;
    }, []);
};

/**
 *
 * @param alerts list of alerts to be filtered
 * @param searchText text to be searched in alert name
 * @param selectedType selecte alert type
 * @returns list of filtered alerts based on searchText & selectedType
 */
export const filterAlertsByStatusAndType = (
  alerts: Alert[] | undefined,
  searchText: string,
  selectedType: string | undefined
): Alert[] => {
  return (
    alerts?.filter(({ label, status, type }) => {
      return (
        status === 'enabled' &&
        (!selectedType || type === selectedType) &&
        (!searchText || label.toLowerCase().includes(searchText.toLowerCase()))
      );
    }) ?? []
  );
};

/**
 *
 * @param alerts list of alerts
 * @returns list of unique alert types in the alerts list in the form of json object
 */
export const convertAlertsToTypeSet = (
  alerts: Alert[] | undefined
): { label: AlertDefinitionType }[] => {
  const types = new Set(alerts?.map(({ type }) => type) ?? []);

  return Array.from(types).reduce(
    (previousValue, type) => [...previousValue, { label: type }],
    []
  );
};
