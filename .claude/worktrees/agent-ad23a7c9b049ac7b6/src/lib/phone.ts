// Indian mobile number normalization — the dedupe key every inbound contact
// touchpoint (lead, enquiry, WhatsApp) is matched against.

/**
 * Normalizes an Indian mobile number to E.164 (+91XXXXXXXXXX).
 * Accepts "9876543210", "091-98765-43210", "+91 98765 43210", etc.
 * Returns null if the input isn't a valid 10-digit Indian mobile number.
 */
export function normalizePhone(input: string): string | null {
  if (!input) return null;
  const digits = input.replace(/\D/g, '');

  let core: string;
  if (digits.length === 10) {
    core = digits;
  } else if (digits.length === 11 && digits.startsWith('0')) {
    core = digits.slice(1);
  } else if (digits.length === 12 && digits.startsWith('91')) {
    core = digits.slice(2);
  } else if (digits.length === 13 && digits.startsWith('091')) {
    core = digits.slice(3);
  } else {
    return null;
  }

  if (!/^[6-9]\d{9}$/.test(core)) return null;
  return `+91${core}`;
}

export function isValidIndianMobile(input: string): boolean {
  return normalizePhone(input) !== null;
}

/** Display formatting: "+919876543210" → "98765 43210" */
export function formatPhoneDisplay(e164: string): string {
  const core = e164.replace(/^\+91/, '');
  if (core.length !== 10) return e164;
  return `${core.slice(0, 5)} ${core.slice(5)}`;
}
