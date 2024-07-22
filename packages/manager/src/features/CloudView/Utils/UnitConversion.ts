import { roundTo } from 'src/utilities/roundTo';

export type Unit =
  | 'B'
  | 'Bps'
  | 'GB'
  | 'GBps'
  | 'Gb'
  | 'Gbps'
  | 'KB'
  | 'KBps'
  | 'Kb'
  | 'Kbps'
  | 'MB'
  | 'MBps'
  | 'Mb'
  | 'Mbps'
  | 'PB'
  | 'PBps'
  | 'Pb'
  | 'Pbps'
  | 'TB'
  | 'TBps'
  | 'Tb'
  | 'Tbps'
  | 'b'
  | 'bps'
  | 'd'
  | 'h'
  | 'm'
  | 'min'
  | 'ms'
  | 's'
  | 'w'
  | 'y';

const supportedUnits = {
  B: 'Bytes',
  Bps: 'Bps',
  GB: 'GB',
  GBps: 'GBps',
  Gb: 'Gb',
  Gbps: 'Gbps',
  KB: 'KB',
  KBps: 'KBps',
  Kb: 'Kb',
  Kbps: 'Kbps',
  MB: 'MB',
  MBps: 'MBps',
  Mb: 'Mb',
  Mbps: 'Mbps',
  PB: 'PB',
  PBps: 'PBps',
  Pb: 'Pb',
  Pbps: 'Pbps',
  TB: 'TB',
  TBps: 'TBps',
  Tb: 'Tb',
  Tbps: 'Tbps',
  b: 'bits',
  bps: 'bps',
  d: 'd',
  h: 'h',
  m: 'mo',
  min: 'min',
  ms: 'ms',
  s: 's',
  w: 'wk',
  y: 'yr',
};

const timeUnits = ['d', 'h', 'm', 'min', 'ms', 's', 'w', 'y'];

const multiplier: { [label: string]: number } = {
  B: 1,
  Bps: 1,
  GB: Math.pow(2, 30),
  GBps: Math.pow(2, 30),
  Gb: 1e9,
  Gbps: 1e9,
  KB: Math.pow(2, 10),
  KBps: Math.pow(2, 10),
  Kb: 1e3,
  Kbps: 1e3,
  MB: Math.pow(2, 20),
  MBps: Math.pow(2, 20),
  Mb: 1e6,
  Mbps: 1e6,
  PB: Math.pow(2, 50),
  PBps: Math.pow(2, 50),
  Pb: 1e15,
  Pbps: 1e15,
  TB: Math.pow(2, 40),
  TBps: Math.pow(2, 40),
  Tb: 1e12,
  Tbps: 1e12,
  b: 1,
  bps: 1,
  d: 24 * 60 * 60 * 1000,
  h: 1000 * 60 * 60,
  m: 1000 * 60 * 60 * 24 * 30,
  min: 1000 * 60,
  ms: 1,
  s: 1000,
  w: 1000 * 60 * 60 * 24 * 7,
  y: 1000 * 60 * 60 * 24 * 365,
};

/**
 *
 * @param value : bit value based on which maximum possible unit will be generated
 * @returns : maximum possible rolled up unit for the input bit value
 */

export const generateUnitByBitValue = (value: number): Unit => {
  if (value < multiplier.kb) {
    return 'b';
  } else if (value < multiplier.Mb) {
    return 'Kb';
  } else if (value < multiplier.Gb) {
    return 'Mb';
  } else if (value < multiplier.Tb) {
    return 'Gb';
  } else if (value < multiplier.Pb) {
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
  if (value < multiplier.KB) {
    return 'B';
  } else if (value < multiplier.MB) {
    return 'KB';
  } else if (value < multiplier.GB) {
    return 'MB';
  } else if (value < multiplier.TB) {
    return 'GB';
  } else if (value < multiplier.PB) {
    return 'TB';
  } else {
    return 'PB';
  }
};

export const generateUnitByTimeValue = (value: number): Unit => {
  if (value < multiplier.s) {
    return 'ms';
  } else if (value < multiplier.min) {
    return 's';
  } else if (value < multiplier.h) {
    return 'min';
  } else if (value < multiplier.d) {
    return 'h';
  } else if (value < multiplier.w) {
    return 'd';
  } else if (value < multiplier.m) {
    return 'w';
  } else if (value < multiplier.y) {
    return 'm';
  } else {
    return 'y';
  }
};
/**
 *
 * @param value : bit value to be rolled up based on maxUnit
 * @param maxUnit : maximum possible unit based on which value will be rolled up
 * @returns : rolled up value based on maxUnit
 */
export const convertValueToMaxUnit = (
  value: number,
  maxUnit: Unit | string
) => {
  const convertingValue = multiplier[maxUnit] ?? 1;

  if (convertingValue === 1) {
    return roundTo(value);
  } else {
    return value / convertingValue;
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
  unit: Unit | string
): number => {
  return convertValueToMaxUnit(value, unit);
};

/**
 *
 * @param value : bits or bytes value to be rolled up to highest possible unit according to base unit.
 * @param baseUnit : bits or bytes unit depends on which unit will be generated for value.
 * @returns : formatted string for the value rolled up to higher possible unit according to base unit.
 */
export const formatToolTip = (value: number, baseUnit: string): string => {
  const unit = generateCurrentUnit(baseUnit);
  let generatedUnit = baseUnit;
  if (unit.endsWith('b') || unit.endsWith('bps')) {
    generatedUnit = generateUnitByBitValue(value);
  } else if (unit.endsWith('B') || unit.endsWith('Bps')) {
    generatedUnit = generateUnitByByteValue(value);
  } else if (timeUnits.includes(unit)) {
    generatedUnit = generateUnitByTimeValue(value);
  }
  const convertedValue = convertValueToMaxUnit(value, generatedUnit);

  if (unit.endsWith('ps')) {
    return `${roundTo(convertedValue)} ${generatedUnit}/s`;
  } else {
    return `${roundTo(convertedValue)} ${generatedUnit}`;
  }
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
): Unit | string => {
  const unit = generateCurrentUnit(baseUnit);
  let generatedUnit = baseUnit;
  if (unit.endsWith('b') || unit.endsWith('bps')) {
    generatedUnit = generateUnitByBitValue(value);
  } else if (unit.endsWith('B') || unit.endsWith('Bps')) {
    generatedUnit = generateUnitByByteValue(value);
  } else if (timeUnits.includes(unit)) {
    generatedUnit = generateUnitByTimeValue(value);
  }
  return generatedUnit;
};

export const generateCurrentUnit = (baseUnit: string): string => {
  let unit: string = baseUnit;

  for (const [key, value] of Object.entries(supportedUnits)) {
    if (value === baseUnit) {
      unit = key;
      break;
    }
  }

  return unit;
};

export const transformData = (data: any[], baseUnit: string): number[][] => {
  const unit: string = generateCurrentUnit(baseUnit);

  const multi: number = multiplier[unit] ?? 1;
  return data.map((d) => [d[0], Number(d[1]) * multi]);
};
