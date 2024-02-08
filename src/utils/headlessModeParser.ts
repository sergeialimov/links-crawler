import { HEADLESS_MODE_VALUES } from '../constants';

function parseHeadlessMode(value: string | undefined): boolean {
  if (!value) {
    return HEADLESS_MODE_VALUES.FALSE;
  }
  const upperCaseValue = value.toUpperCase() as keyof typeof HEADLESS_MODE_VALUES;
  return HEADLESS_MODE_VALUES[upperCaseValue] || HEADLESS_MODE_VALUES.FALSE;
}

export default parseHeadlessMode;
