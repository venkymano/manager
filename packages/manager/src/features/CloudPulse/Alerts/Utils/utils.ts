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
