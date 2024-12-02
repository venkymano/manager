import type { ServiceTypesList } from '@linode/api-v4';

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

  // Construct the result string
  const minuteString =
    minutes > 0 ? `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}` : '';
  const secondString =
    remainingSeconds > 0
      ? `${remainingSeconds} ${remainingSeconds === 1 ? 'second' : 'seconds'}`
      : '';

  if (minuteString && secondString) {
    return `${minuteString} and ${secondString}`;
  }

  return minuteString || secondString;
};

/**
 * @param timestamp The timestamp that needs to be converted
 * @returns Formatted date string for a given timestamp, e.g., Nov 30, 2024, 12:42PM
 */
export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric', // Numeric day (e.g., 20)
    hour: 'numeric', // Numeric hour
    hour12: true, // Use 12-hour clock
    minute: 'numeric', // Numeric minutes
    month: 'short', // Short month name (e.g., Nov)
    year: 'numeric', // Include the year
  };

  const formattedDate = date.toLocaleString('en-US', options);

  // Ensure a comma is placed after the day and before the year
  return formattedDate.replace(/(\w+ \d+)( \d{4})/, '$1,$2');
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
