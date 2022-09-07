export const PAYMENT_KEYS = ['heat', 'megaCredits', 'steel', 'titanium', 'microbes', 'floaters', 'science', 'seeds', 'data'] as const;
export type PaymentKey = typeof PAYMENT_KEYS[number];
export type Payment = {
  // Standard currency for paying for stuff
  megaCredits: number;
  // Helion corporation can spend heat as M€.
  heat: number;
  // Used for cards with building tags
  steel: number;
  // Used for cards with space tags
  titanium: number;
  // Psychrophiles corporation can spend its floaters for cards with plant tags.
  microbes: number;
  // Dirigibles corporation can spend its floaters for cards with Venus tags.
  floaters: number;
  // Luna Archives corporation can spend its science resources for cards with Moon tags.
  science: number;
  // TODO: add test for Soylent Seedling Systems + Psychophiles.
  // Soylent Seedling Systems corporation can use its seeds to pay for cards with plant tags, or the standard greenery project.
  seeds: number;
  // Aurorai corporation can use its data to pay for standard projects.
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

  export function of(payment: Partial<Payment>) : Payment {
    return {
      data: payment.data ?? 0,
      floaters: payment.floaters ?? 0,
      heat: payment.heat ?? 0,
      megaCredits: payment.megaCredits ?? 0,
      microbes: payment.microbes ?? 0,
      science: payment.science ?? 0,
      seeds: payment.seeds ?? 0,
      steel: payment.steel ?? 0,
      titanium: payment.titanium ?? 0,
    };
  }
}
