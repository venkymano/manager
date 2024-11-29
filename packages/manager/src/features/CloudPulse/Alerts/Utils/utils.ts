import type { AlertDimensionsProp } from '../AlertsDetail/AlertDetailChips';
import type { NotificationChannel } from '@linode/api-v4';

export const convertSecondsToMinutes = (seconds: number): string => {
  if (seconds === 0) {
    return '0 minutes';
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Construct the result string
  const minuteString =
    minutes > 0 ? `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}` : '';
  const secondString =
    remainingSeconds > 0
      ? ` and ${remainingSeconds} ${
          remainingSeconds === 1 ? 'second' : 'seconds'
        }`
      : '';

  return minuteString + secondString;
};

export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric', // Numeric day (e.g., 20)
    hour: 'numeric', // Numeric hour
    hour12: true, // Use 12-hour clock
    minute: 'numeric', // Numeric minutes
    month: 'short', // Short month name (e.g., Nov)
  };

  return date.toLocaleString('en-US', options);
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
