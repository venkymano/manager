import { convertValueToMaxUnit, generateCurrentUnit, generateUnitByBitValue, generateUnitByByteValue, generateUnitByTimeValue } from "./UnitConversion";

describe('Unit conversion', () => {
  it('should check current unit to be converted into appropriate unit', ()=>{

    expect(generateCurrentUnit('Bytes')).toBe('B');
    expect(generateCurrentUnit('%')).toBe('%');
  }),

  it('should generate rolled up unit based on value', ()=>{
      expect(generateUnitByByteValue(2024)).toBe('KB');
      expect(generateUnitByBitValue(999)).toBe('b');
      expect(generateUnitByTimeValue(364000)).toBe('min');
  }),
  it('should roll up value based on unit', ()=>{
    expect(convertValueToMaxUnit(2048, 'KB')).toBe(2);
    expect(convertValueToMaxUnit(3000000, 'Mb')).toBe(3);
    expect(convertValueToMaxUnit(60000, 'min')).toBe(1);
  })
});
