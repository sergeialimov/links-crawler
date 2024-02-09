import { parseHeadlessMode } from '../../src/utils';
import { HEADLESS_MODE_VALUES } from '../../src/constants';

describe('parseHeadlessMode', () => {
  it('should return false for undefined input', () => {
    const result = parseHeadlessMode(undefined);
    expect(result).toBe(HEADLESS_MODE_VALUES.FALSE);
  });

  it('should return false for empty string input', () => {
    const result = parseHeadlessMode('');
    expect(result).toBe(HEADLESS_MODE_VALUES.FALSE);
  });

  it('should return true for "true" string input', () => {
    const result = parseHeadlessMode('true');
    expect(result).toBe(HEADLESS_MODE_VALUES.TRUE);
  });

  it('should return false for "false" string input', () => {
    const result = parseHeadlessMode('false');
    expect(result).toBe(HEADLESS_MODE_VALUES.FALSE);
  });

  it('should return true for "TRUE" string input (case-insensitive)', () => {
    const result = parseHeadlessMode('TRUE');
    expect(result).toBe(HEADLESS_MODE_VALUES.TRUE);
  });

  it('should return false for "FALSE" string input (case-insensitive)', () => {
    const result = parseHeadlessMode('FALSE');
    expect(result).toBe(HEADLESS_MODE_VALUES.FALSE);
  });

  it('should return false for invalid string input', () => {
    const result = parseHeadlessMode('invalid');
    expect(result).toBe(HEADLESS_MODE_VALUES.FALSE);
  });

  it('should return false for null input', () => {
    const result = parseHeadlessMode(undefined);
    expect(result).toBe(HEADLESS_MODE_VALUES.FALSE);
  });

  it('should return false for numeric input', () => {
    const result = parseHeadlessMode('123');
    expect(result).toBe(HEADLESS_MODE_VALUES.FALSE);
  });
});
