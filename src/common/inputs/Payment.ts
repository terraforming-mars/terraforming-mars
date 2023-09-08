// https://steveholgado.com/typescript-types-from-arrays/
export const PAYMENT_KEYS = [
  'heat',
  'megaCredits',
  'steel',
  'titanium',
  'microbes',
  'floaters',
  'science',
  'seeds',
  'auroraiData',
  'graphene'] as const;
export type PaymentKey = typeof PAYMENT_KEYS[number];

/**
 * The units of resources to deduct from the player's play area. These resources are all worth
 * megacredits under certain conditions.
 *
 * At this point, megaCredits means actual money, because (for instance if the player was Helion) they
 * probably chose to spend money instead of heat.
 *
 * Exception: Player.pay({heat}) still triggers asking the caller if they want to spend Stormcraft resources.
 */
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
  // TODO(kberg): add test for Soylent Seedling Systems + Psychophiles.
  // Soylent Seedling Systems corporation can use its seeds to pay for cards with plant tags, or the standard greenery project.
  seeds: number;
  // Aurorai corporation can use its data to pay for standard projects.
  auroraiData: number;
  // Graphene is a Carbon Nanosystems resource that pays for city and space projects.
  graphene: number;
}

export function isPayment(obj: unknown): obj is Payment {
  if (typeof obj !== 'object') return false;
  if (!obj) return false;
  const h = obj as Payment; // Still might not be Payment, but h is does not escape this method.
  return PAYMENT_KEYS.every((key) =>
    h.hasOwnProperty(key) && typeof h[key] === 'number' && !isNaN(h[key]));
}

export namespace Payment {
  export const EMPTY: Readonly<Payment> = {
    heat: 0,
    megaCredits: 0,
    steel: 0,
    titanium: 0,
    microbes: 0,
    floaters: 0,
    science: 0,
    seeds: 0,
    auroraiData: 0,
    graphene: 0,
  } as const;

  export interface Options {
    steel: boolean,
    titanium: boolean,
    floaters: boolean,
    microbes: boolean,
    science: boolean,
    seeds: boolean,
    auroraiData: boolean,
    graphene: boolean,
  }

  export function of(payment: Partial<Payment>) : Payment {
    return {
      auroraiData: payment.auroraiData ?? 0,
      floaters: payment.floaters ?? 0,
      heat: payment.heat ?? 0,
      megaCredits: payment.megaCredits ?? 0,
      microbes: payment.microbes ?? 0,
      science: payment.science ?? 0,
      seeds: payment.seeds ?? 0,
      steel: payment.steel ?? 0,
      titanium: payment.titanium ?? 0,
      graphene: payment.graphene ?? 0,
    };
  }
}
