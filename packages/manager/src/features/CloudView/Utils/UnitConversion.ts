export type Unit =
  | 'B'
  | 'GB'
  | 'Gb'
  | 'KB'
  | 'Kb'
  | 'MB'
  | 'Mb'
  | 'PB'
  | 'Pb'
  | 'TB'
  | 'Tb'
  | 'b';

const bitRegex = /[bB][iI][tT][sS]{0,1}/;
const byteRegex = /[bB][yY][tT][eE][sS]{0,1}/;

/**
 *
 * @param value : bit value based on which maximum possible unit will be generated
 * @returns : maximum possible rolled up unit for the input bit value
 */

export const generateUnitByBitValue = (value: number): Unit => {
  if (value <= 1e3) {
    return 'b';
  } else if (value <= 1e6) {
    return 'Kb';
  } else if (value <= 1e9) {
    return 'Mb';
  } else if (value <= 1e12) {
    return 'Gb';
  } else if (value <= 1e15) {
    return 'Tb';
  } else {
    return 'Pb';
  }
};

/**
 *
 * @param value : byte value based on which maximum possible unit will be generated
 * @returns : maximum possible rolled up unit for the input byte value
 */
export const generateUnitByByteValue = (value: number): Unit => {
  if (value <= 1e3) {
    return 'B';
  } else if (value <= 1e6) {
    return 'KB';
  } else if (value <= 1e9) {
    return 'MB';
  } else if (value <= 1e12) {
    return 'GB';
  } else if (value <= 1e15) {
    return 'TB';
  } else {
    return 'PB';
  }
};
/**
 *
 * @param value : bit value to be rolled up based on maxUnit
 * @param maxUnit : maximum possible unit based on which value will be rolled up
 * @returns : rolled up value based on maxUnit
 */
export const convertBitsToUnit = (value: number, maxUnit: Unit) => {
  if (maxUnit === 'Pb') {
    return value / 1e15;
  } else if (maxUnit === 'Tb') {
    return value / 1e12;
  } else if (maxUnit === 'Gb') {
    return value / 1e9;
  } else if (maxUnit === 'Mb') {
    return value / 1e6;
  } else if (maxUnit === 'Kb') {
    return value / 1e3;
  } else {
    return Math.round(value);
  }
};

/**
 *
 * @param value : byte value to be rolled up based on maxUnit
 * @param maxUnit : maximum possible unit based on which value will be rolled up
 * @returns : rolled up value based on maxUnit
 */
export const convertBytesToUnit = (value: number, maxUnit: Unit) => {
  if (maxUnit === 'PB') {
    return value / 1e15;
  } else if (maxUnit === 'TB') {
    return value / 1e12;
  } else if (maxUnit === 'GB') {
    return value / 1e9;
  } else if (maxUnit === 'MB') {
    return value / 1e6;
  } else if (maxUnit === 'KB') {
    return value / 1e3;
  } else {
    return Math.round(value);
  }
};

/**
 *
 * @param value : bits/bytes value that to be rolled up base on the unit
 * @param unit : Unit object based on which value will be rolled up
 * @param baseUnit : base unit to identify whether data is to be rolled up for bits or bytes
 * @returns : rolled up value based on unit & baseUnit
 */
export const convertValueToUnit = (
  value: number,
  unit: Unit,
  baseUnit: string
): number => {
  if (bitRegex.test(baseUnit)) {
    return convertBitsToUnit(value, unit);
  } else if (byteRegex.test(baseUnit)) {
    return convertBytesToUnit(value, unit);
  } else {
    return 0;
  }
};

/**
 *
 * @param value : bits or bytes value to be rolled up to highest possible unit according to base unit.
 * @param baseUnit : bits or bytes unit depends on which unit will be generated for value.
 * @returns : formatted string for the value rolled up to higher possible unit according to base unit.
 */
export const formatToolTip = (value: number, baseUnit: string): string => {
  const _unit = generateUnitByBaseUnit(value, baseUnit);
  if (!_unit) {
    return '';
  }
  let convertedValue = 0;

  if (bitRegex.test(baseUnit)) {
    convertedValue = convertBitsToUnit(value, _unit);
  } else {
    convertedValue = convertBytesToUnit(value, _unit);
  }

  return `${Math.round(convertedValue * 100) / 100} ${_unit}`;
};

/**
 *
 * @param value : bits or bytes value for which unit to be generate
 * @param baseUnit : bits or bytes unit depends on which unit will be generated for value
 * @returns : Unit object if base unit is bits or bytes otherwise undefined
 */
export const generateUnitByBaseUnit = (
  value: number,
  baseUnit: string
): Unit | undefined => {
  if (bitRegex.test(baseUnit)) {
    return generateUnitByBitValue(value);
  } else if (byteRegex.test(baseUnit)) {
    return generateUnitByByteValue(value);
  } else {
    return undefined;
  }
};

/**
 *
 * @param baseUnit : base unit value to match with bits & bytes regex
 * @returns : true if baseUnit is bytes or bits else false
 */
export const isBitsOrBytesUnit = (baseUnit: string): boolean => {
  return bitRegex.test(baseUnit) || byteRegex.test(baseUnit);
};
