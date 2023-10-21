import {DATA_VALUE, FLOATERS_VALUE, MICROBES_VALUE, GRAPHENE_VALUE, SEED_VALUE} from '../constants';
import {SpendableResource, SPENDABLE_RESOURCES} from './Spendable';

/**
 * The units of resources to deduct from the player's play area. These resources are all worth
 * megacredits under certain conditions.
 *
 * At this point, megaCredits means actual money, because (for instance if the player was Helion) they
 * probably chose to spend money instead of heat.
 *
 * Exception: Player.pay({heat}) still triggers asking the caller if they want to spend Stormcraft resources.
 */
export type Payment = {[k in SpendableResource]: number};

export function isPayment(obj: unknown): obj is Payment {
  if (typeof obj !== 'object') return false;
  if (!obj) return false;
  const h = obj as Payment; // Still might not be Payment, but h is does not escape this method.
  return SPENDABLE_RESOURCES.every((key) =>
    h.hasOwnProperty(key) && typeof h[key] === 'number' && !isNaN(h[key]));
}

export const DEFAULT_PAYMENT_VALUES: Record<SpendableResource, number> = {
  megaCredits: 1,
  steel: 2,
  titanium: 3,
  heat: 1,
  plants: 3,

  microbes: MICROBES_VALUE,
  floaters: FLOATERS_VALUE,
  lunaArchivesScience: 1,
  spireScience: 2,
  seeds: SEED_VALUE,
  auroraiData: DATA_VALUE,
  graphene: GRAPHENE_VALUE,
  kuiperAsteroids: 1,
} as const;

export namespace Payment {
  export const EMPTY: Readonly<Payment> = {
    heat: 0,
    megaCredits: 0,
    steel: 0,
    titanium: 0,
    plants: 0,
    microbes: 0,
    floaters: 0,
    lunaArchivesScience: 0,
    spireScience: 0,
    seeds: 0,
    auroraiData: 0,
    graphene: 0,
    kuiperAsteroids: 0,
  } as const;

  export function of(payment: Partial<Payment>) : Payment {
    return {
      auroraiData: payment.auroraiData ?? 0,
      floaters: payment.floaters ?? 0,
      heat: payment.heat ?? 0,
      lunaArchivesScience: payment.lunaArchivesScience ?? 0,
      spireScience: payment.spireScience ?? 0,
      megaCredits: payment.megaCredits ?? 0,
      microbes: payment.microbes ?? 0,
      seeds: payment.seeds ?? 0,
      steel: payment.steel ?? 0,
      titanium: payment.titanium ?? 0,
      graphene: payment.graphene ?? 0,
      kuiperAsteroids: payment.kuiperAsteroids ?? 0,
      plants: payment.plants ?? 0,
    };
  }
}

/**
 * See PaymentOptions.
 */
type WaysToPay = Exclude<SpendableResource, 'megaCredits'> | 'lunaTradeFederationTitanium';

/**
 * PaymentOptions describes the ways you can pay for something.
 *
 * This is different from Payment, which describes what is being used to pay for something.
 *
 * PaymentOptions says "You can spend heat, microbes, and seeds", and Payment says "Here's 3 heat and 1 seed."
 *
 * That's why PaymentOptions includes two references to titanium. One describes paying for space cards
 * (good ol' titanium) and one describes a special behavior for the Luna Archives corporation that lets you
 * spend titanium in a new way.
 *
 * megaCredits is removed because it's always assumed and I think it's possibly special-cased the codebase.
 * Could be smart to remove it, /shrug
 */
export type PaymentOptions = {[k in WaysToPay]: boolean};
