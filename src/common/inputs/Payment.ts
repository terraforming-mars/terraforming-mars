import {CardName} from '../cards/CardName';
import {DATA_VALUE, FLOATERS_VALUE, MICROBES_VALUE, GRAPHENE_VALUE, SEED_VALUE} from '../constants';

export const STANDARD_PAYMENT_UNITS = [
  // Standard currency for paying for stuff
  'megaCredits',
  // Helion corporation can spend heat as M€.
  'heat',
  // Used for cards with building tags
  'steel',
  // Used for cards with space tags, and as the Luna Trade Federation
  'titanium',
  // Martian Lumber Corp lets players pay for building tags with plants.
  'plants',
] as const;

export const CARD_PAYMENT_UNITS = [
  // Psychrophiles corporation can spend its floaters for cards with plant tags.
  'microbes',
  // Dirigibles corporation can spend its floaters for cards with Venus tags.
  'floaters',
  // Luna Archives corporation can spend its science resources for cards with Moon tags.
  'lunaArchivesScience',
  // Spire corporation can spend its science resources on standrad projects.
  'spireScience',
  // TODO(kberg): add test for Soylent Seedling Systems + Psychophiles.
  // Soylent Seedling Systems corporation can use its seeds to pay for cards with plant tags, or the standard greenery project.
  'seeds',
  // Aurorai corporation can use its data to pay for standard projects.
  'auroraiData',
  // Graphene is a Carbon Nanosystems resource that pays for city and space projects.
  'graphene',
  // Asteroids is a Kuiper Cooperative resource that pays for aquifer and asteroid standard projects.
  'kuiperAsteroids',
] as const;

export const PAYMENT_UNITS = [...STANDARD_PAYMENT_UNITS, ...CARD_PAYMENT_UNITS] as const;

export type StandardPaymentUnit = typeof STANDARD_PAYMENT_UNITS[number];
/** Types of resources on cards that can be spent to pay for things. */
export type CardResourcePaymentUnit = typeof CARD_PAYMENT_UNITS[number];

/** Types of resources spent to pay for things. */
export type PaymentUnit = StandardPaymentUnit | CardResourcePaymentUnit;


// TODO(kberg): get a better name
export const CARD_RESOURCE_PAYMENT_MAP: Record<CardResourcePaymentUnit, CardName> = {
  microbes: CardName.PSYCHROPHILES,
  floaters: CardName.DIRIGIBLES,
  lunaArchivesScience: CardName.LUNA_ARCHIVES,
  spireScience: CardName.SPIRE,
  seeds: CardName.SOYLENT_SEEDLING_SYSTEMS,
  auroraiData: CardName.AURORAI,
  graphene: CardName.CARBON_NANOSYSTEMS,
  kuiperAsteroids: CardName.KUIPER_COOPERATIVE,
} as const;

/**
 * The units of resources to deduct from the player's play area. These resources are all worth
 * megacredits under certain conditions.
 *
 * At this point, megaCredits means actual money, because (for instance if the player was Helion) they
 * probably chose to spend money instead of heat.
 *
 * Exception: Player.pay({heat}) still triggers asking the caller if they want to spend Stormcraft resources.
 */
export type Payment = {[k in PaymentUnit]: number};

export function isPayment(obj: unknown): obj is Payment {
  if (typeof obj !== 'object') return false;
  if (!obj) return false;
  const h = obj as Payment; // Still might not be Payment, but h is does not escape this method.
  return PAYMENT_UNITS.every((key) =>
    h.hasOwnProperty(key) && typeof h[key] === 'number' && !isNaN(h[key]));
}

export const DEFAULT_PAYMENT_VALUES: Record<PaymentUnit, number> = {
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

type WaysToPay = Exclude<PaymentUnit, 'megaCredits'> | 'lunaTradeFederationTitanium';
/**
 * PaymentOptions describes the ways you can pay for something.
 *
 * This is different from Payment, which describes what is being used to pay for something.
 *
 * PaymentOptions says "You can spend heat, microbes, and seeds", and Payment says "Here's 3 heat and 1 seed."
 *
 * That's why PaymentOptions includes two references to titanium. One describes paying for space cards (
 * good ol' titanium) and one describes a special behavior for the Luna Archives corporation that lets you
 * spend titanium in a new way.
 *
 * megaCredits is removed because it's always assumed.
 */
export type PaymentOptions = {[k in WaysToPay]: boolean};
