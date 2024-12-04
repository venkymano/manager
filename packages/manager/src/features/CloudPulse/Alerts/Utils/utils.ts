import type { AlertDimensionsProp } from '../AlertsDetail/AlertDetailChips';
import type { NotificationChannel, ServiceTypesList } from '@linode/api-v4';
import type { Theme } from '@mui/material';

/**
 * Converts seconds into a human-readable minutes and seconds format.
 *
 * @param seconds The seconds that need to be converted into minutes.
 * @returns A string representing the time in minutes and seconds.
 */
export const convertSecondsToMinutes = (seconds: number): string => {
  if (seconds === 0) {
    return '0 minutes';
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const minuteString = `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
  const secondString = `${remainingSeconds} ${
    remainingSeconds === 1 ? 'second' : 'seconds'
  }`;

  if (!minutes) {
    return secondString;
  }
  if (!remainingSeconds) {
    return minuteString;
  }

  return `${minuteString} and ${secondString}`;
};

/**
 * @param timestamp The timestamp that needs to be converted
 * @returns Formatted date string for a given timestamp, e.g., Nov 30, 2024, 12:42PM
 */
export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);

  // Intl.DateTimeFormat directly supports custom formatting
  const formatter = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    hour: 'numeric',
    hour12: true,
    minute: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return formatter.format(date);
};

export const getChipLabels = (
  value: NotificationChannel
): AlertDimensionsProp => {
  if (value.channel_type === 'email') {
    return {
      chips: value.content.channel_type.email_addresses,
      label: 'To',
    };
  } else if (value.channel_type === 'slack') {
    return {
      chips: [value.content.channel_type.slack_webhook_url],
      label: 'Slack Webhook URL',
    };
  } else if (value.channel_type === 'pagerduty') {
    return {
      chips: [value.content.channel_type.service_api_key],
      label: 'Service API Key',
    };
  } else {
    return {
      chips: [value.content.channel_type.webhook_url],
      label: 'Webhook URL',
    };
  }
};

/**
 * @param serviceType Service type for which the label needs to be displayed
 * @param serviceTypes List of available service types in ACLP
 * @returns The label for the given service type
 */
export const getServiceTypeLabel = (
  serviceType: string,
  serviceTypes: ServiceTypesList | undefined
) => {
  if (!serviceTypes) {
    return serviceType;
  }

  for (const service of serviceTypes?.data) {
    if (service.service_type === serviceType) {
      return service.label;
    }
  }

  return serviceType;
};

/**
 *
 * @param theme mui theme
 * @returns The style needed for grids in alerts
 */
export const getAlertGridStyles = (theme: Theme) => ({
  backgroundColor:
    theme.name === 'light' ? theme.color.grey5 : theme.color.grey9,
  overflow: 'auto',
  padding: theme.spacing(3),
});
