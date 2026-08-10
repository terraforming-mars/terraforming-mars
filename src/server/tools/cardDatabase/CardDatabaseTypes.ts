import {CardResource} from '@/common/CardResource';
import {CardType} from '@/common/cards/CardType';
import {Expansion} from '@/common/cards/GameModule';
import {Resource} from '@/common/Resource';
import {Tag} from '@/common/cards/Tag';
import {TileType} from '@/common/TileType';

/** The game modules this database covers. */
export const CARD_SETS = ['base', 'corpera', 'prelude'] as const;
export type CardSet = typeof CARD_SETS[number];

/** How a card enters play: as a project from hand, as a starting corporation, or as a prelude. */
export const CARD_KINDS = ['project', 'corporation', 'prelude'] as const;
export type CardKind = typeof CARD_KINDS[number];

/** The named quantities a requirement can measure. */
export const REQUIREMENT_TYPES = [
  'tag', 'production', 'removed_plants',
  'oxygen', 'temperature', 'oceans', 'greeneries', 'cities',
  'venus', 'tr', 'resource_types', 'colonies', 'floaters', 'party_leaders',
  'habitat_tiles', 'mining_tiles', 'road_tiles',
  'habitat_rate', 'mining_rate', 'logistic_rate',
  'underground_tokens', 'corruption',
] as const;
export type RequirementType = typeof REQUIREMENT_TYPES[number];

/** A condition that must hold before the card may be played. */
export type Requirement = {
  type: RequirementType,
  /** Set when `type` is 'tag'. */
  tag?: Tag,
  /** Set when `type` is 'production'. */
  resource?: Resource,
  /** Inclusive lower bound. Present unless the requirement is a maximum. */
  min?: number,
  /** Inclusive upper bound. */
  max?: number,
  /** When 'any_player', every player's assets count, not only the card owner's. */
  scope?: 'any_player',
  /** When true, only tiles adjacent to the tile this card places are counted. */
  next_to?: boolean,
  /** Free text printed on the physical card that the structured fields do not capture. */
  text?: string,
};

/** The things a game-state-dependent quantity can count. */
export const DYNAMIC_COUNTS = [
  'tag', 'cities', 'greeneries', 'oceans', 'resources_here', 'floaters', 'events_played',
] as const;
export type DynamicCount = typeof DYNAMIC_COUNTS[number];

/** A quantity derived from the game state instead of a fixed number. */
export type Dynamic = {
  counts: DynamicCount,
  /** Which tag or tags are counted. Set when `counts` is 'tag'. */
  tag?: Tag | Array<Tag>,
  /**
   * Whose assets are counted. Omitted means the natural default: your own for
   * tags, the whole board for tiles.
   */
  scope?: 'everyone' | 'opponents',
  /** Multiply the count by this. Applied before `per`. */
  each?: number,
  /** Divide the count by this, rounding down. */
  per?: number,
  /** Only count things adjacent to the tile this card places. */
  next_to_this?: boolean,
  /** Include event cards when counting tags. */
  include_events?: boolean,
};

/** A fixed number, or a quantity computed from the game state. */
export type Amount = number | {dynamic: Dynamic};

/** Standard resource quantities. Negative values are reductions. */
export type ResourceAmounts = Partial<Record<Resource, Amount>>;

/** A tile this card puts on the board. */
export type PlaceTile = {
  /** 'ocean', 'city', 'greenery', or a `TileType` value for a special tile. */
  tile: string | TileType,
  /** How many tiles. Defaults to 1 when absent. */
  count?: number,
  /** The `PlacementType` restricting where the tile may go. */
  on?: string,
  /** A named space the tile must occupy. */
  space?: string,
  /** The prompt shown to the player, which usually spells out the placement rule. */
  title?: string,
};

/** Something the card does: on play, as its action, or as its corporation first action. */
export type Effect = {
  /** Paid before the rest of the effect happens. Only one kind of payment per effect. */
  spend?: ResourceAmounts & {
    resources_here?: number,
    cards?: number,
    resource_from_any_card?: CardResource,
    /** Standard resources accepted in place of M€. */
    can_pay_with?: Array<'steel' | 'titanium'>,
  },
  /** Forgiving loss: takes what the player has and never blocks the effect. */
  lose?: {production?: ResourceAmounts, stock?: ResourceAmounts},
  /** Production changes for the card owner. */
  production?: ResourceAmounts,
  /** Resources and rating the card owner gains. */
  gain?: ResourceAmounts & {
    tr?: Amount,
    /** Resources added to this card itself. */
    resources_here?: Amount,
    /** Free choice of standard resources. */
    standard_resource?: {count: number, same: boolean},
  },
  /** Cards drawn from the project deck. */
  draw?: {
    count: Amount,
    /** Keep this many of the drawn cards and discard the rest. */
    keep?: number,
    /** The player may buy the drawn cards instead of taking them free. */
    pay?: boolean,
    /** Only cards with this tag are kept. */
    tag?: Tag,
    /** Only cards of this type are kept. */
    type?: CardType,
    /** Only cards storing this resource are kept. */
    resource?: CardResource,
  },
  /** Global parameter increases, in steps. */
  global?: {temperature?: number, oxygen?: number, venus?: number},
  /** Tiles placed on the board. */
  place?: Array<PlaceTile>,
  /** Reduce a chosen player's production. The card owner may be the target. */
  decrease_any_production?: {resource: Resource, count: number},
  /** Remove plants from a chosen player. */
  remove_any_plants?: number,
  /** Resources added to cards other than, or including, this one. */
  add_resources_to_any_card?: Array<{
    count: Amount,
    resource?: CardResource,
    tag?: Tag,
    /** This card cannot be the target. */
    exclude_this?: boolean,
    /** A legal target card must exist for the effect to be taken. */
    must_have_card?: boolean,
    /** Only cards already holding at least this many resources are eligible. */
    min?: number,
  }>,
  /** Permanent increase to what one steel is worth in M€. */
  steel_value?: number,
  /** Permanent increase to what one titanium is worth in M€. */
  titanium_value?: number,
  /** Permanent reduction to the plant cost of placing a greenery. */
  greenery_discount?: number,
  /** The player picks exactly one of these. */
  or?: Array<Effect & {title: string}>,
};

/** A continuous or triggered effect that is not expressible as declarative data. */
export type Passive = {
  /** The game event that fires the effect. */
  trigger: string,
  /** What happens when it fires. */
  effect: string,
};

/** One card. */
export type CardEntry = {
  id: string,
  name: string,
  set: CardSet,
  kind: CardKind,
  type: CardType,
  /** The number printed on the physical card. */
  card_number?: string,
  /** The rules text printed on the physical card. */
  description?: string,
  /** M€ cost. Absent for corporations. */
  cost?: number,
  /**
   * M€ a corporation starts with, or the M€ a prelude grants. A negative value
   * is a cost the player must pay when the prelude is played.
   */
  starting_megacredits?: number,
  /** Fixed price this corporation pays per card during research. */
  card_cost?: number,
  tags: Array<Tag>,
  /** The card resource this card stores. */
  resource_type?: CardResource,
  /** Other players may not remove resources from this card. */
  protected_resources?: boolean,
  /** Fixed victory points. Negative values are penalties. */
  vp?: number,
  /** Victory points computed from the game state. */
  vp_dynamic?: Dynamic,
  /** True when scoring needs bespoke logic; read `semantics`. */
  vp_special?: boolean,
  requirements?: Array<Requirement>,
  /** What happens when the card is played. */
  immediate?: Effect,
  /** A corporation's first action of the game. */
  first_action?: Effect & {text?: string},
  /** The repeatable action of an active card. */
  action?: Effect,
  /** Permanent discount this card gives on playing other cards. */
  card_discount?: Array<{tag?: Tag, amount: number, per?: 'card' | 'tag'}>,
  /** Permanent shift to this player's global parameter requirements. */
  global_parameter_requirement_bonus?: {steps: number, parameter?: string, next_card_only?: boolean},
  /** Expansions this card additionally requires. */
  compatibility?: Array<Expansion>,
  /** True when part of this card's behavior lives in code, not in data. */
  bespoke: boolean,
  /** Prose statement of everything the structured fields cannot express. */
  semantics?: string,
  /** Triggered and continuous effects. */
  passive?: Array<Passive>,
  /** Restriction on when the card may be played or where its tile may go. */
  play_restriction?: string,
};

/** A row of the lightweight lookup table. */
export type IndexEntry = {
  id: string,
  name: string,
  set: CardSet,
  kind: CardKind,
  type: CardType,
  cost?: number,
  tags: Array<Tag>,
  vp?: number,
  bespoke: boolean,
};
