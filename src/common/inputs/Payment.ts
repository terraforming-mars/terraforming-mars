export const PAYMENT_KEYS = ['heat', 'megaCredits', 'steel', 'titanium', 'microbes', 'floaters', 'science', 'seeds', 'data'] as const;
export type PaymentKey = typeof PAYMENT_KEYS[number];
export type Payment = {
  heat: number;
  megaCredits: number;
  steel: number;
  titanium: number;
  microbes: number;
  floaters: number;
  science: number;
  seeds: number;
  data: number;
}

export function isPayment(obj: unknown): obj is Payment {
  if (typeof obj !== 'object') return false;
  if (!obj) return false;
  const h = obj as Payment; // Still might not be Payment, but h is does not escape this method.
  return PAYMENT_KEYS.every((key) =>
    h.hasOwnProperty(key) && typeof h[key] === 'number' && !isNaN(h[key]));
}

export function jsonToPayment(json: string): Payment {
  try {
    const payment: unknown = JSON.parse(json);
    if (!isPayment(payment)) {
      console.error('Not type Payment: ' + json);
      throw new Error('input is not Payment');
    }
    return payment;
  } catch (err) {
    throw new Error('Unable to parse input as Payment ' + err);
  }
}

export namespace Payment {
  export const EMPTY: Readonly<Payment> = {
    heat: 0, megaCredits: 0, steel: 0, titanium: 0, microbes: 0, floaters: 0, science: 0, seeds: 0, data: 0,
  } as const;

  export interface Options {
    steel: boolean,
    titanium: boolean,
    floaters: boolean,
    microbes: boolean,
    science: boolean,
    seeds: boolean,
    data: boolean,
  }
}
