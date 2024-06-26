export type Unit = 'Pb' | 'Tb' | 'Gb' | 'Kb' | 'Mb' | 'b';

/**
 * converts bytes to either Kb (Kilobits) or Mb (Megabits) or Gb (Gigabits)
 * depending on if the Kilobit conversion exceeds 1000.
 *
 * @param networkUsedInBytes inbound and outbound traffic in bytes
 */
export const generateUnitByByteValue = (networkUsedInBytes: number): Unit => {
  const networkUsedToKilobits = (networkUsedInBytes * 8) / 1000;
  if (networkUsedToKilobits <= 1) {
    return 'b';
  } else if (networkUsedToKilobits <= 1e3) {
    return 'Kb';
  } else if (networkUsedToKilobits <= 1e6) {
    return 'Mb';
  } else if(networkUsedToKilobits <= 1e9) {
    return 'Gb';
  }else if (networkUsedToKilobits <= 1e12){
    return 'Tb';
  }else{
    return 'Pb';
  }
};

export const convertBytesToUnit = (valueInBits: number, maxUnit: Unit) => {
  if (maxUnit === 'Pb') {
    return valueInBits / 1e15;
  }
  else if (maxUnit === 'Tb') {
    return valueInBits / 1e12;
  }
  else if (maxUnit === 'Gb') {
    return valueInBits / 1e9;
  } else if (maxUnit === 'Mb') {
    return valueInBits / 1e6;
  } else if (maxUnit === 'Kb') {
    return valueInBits / 1e3;
  } else {
    return Math.round(valueInBits);
  }
};

export const formatToolTip = (valueInBytes: number) => {
  const _unit = generateUnitByByteValue(valueInBytes);

  const converted = convertBytesToUnit(valueInBytes * 8, _unit);

  return `${Math.round(converted * 100) / 100} ${_unit}`;
};
