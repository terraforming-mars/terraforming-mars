import {AddResource, Behavior} from '@/server/behavior/Behavior';
import {Amount, Dynamic, DynamicCount, Effect, PlaceTile, ResourceAmounts} from './CardDatabaseTypes';
import {Countable, CountableUnits, _Countable} from '@/server/behavior/Countable';
import {CountableVictoryPoints} from '@/common/cards/CountableVictoryPoints';
import {Units} from '@/common/Units';
import {asArray} from '@/common/utils/utils';

/** Behavior stanzas belonging to modules this database does not cover. */
const OUT_OF_SCOPE = ['colonies', 'turmoil', 'moon', 'underworld'] as const;

/** Countable keys that carry no attributes, mapped to their exported name. */
const SIMPLE_COUNTS = {
  cities: 'cities',
  greeneries: 'greeneries',
  oceans: 'oceans',
  resourcesHere: 'resources_here',
  floaters: 'floaters',
  eventsPlayed: 'events_played',
} as const satisfies Partial<Record<keyof _Countable, DynamicCount>>;

function isEmpty(value: object): boolean {
  return Object.keys(value).length === 0;
}

function undefinedIfEmpty<T extends object>(value: T): T | undefined {
  return isEmpty(value) ? undefined : value;
}

/** Translates a game-state-dependent count into the exported database's form. */
export function normalizeDynamic(countable: _Countable): Dynamic {
  for (const key of OUT_OF_SCOPE) {
    if (countable[key] !== undefined) {
      throw new Error('Unsupported countable: ' + JSON.stringify(countable));
    }
  }

  let dynamic: Dynamic | undefined = undefined;
  if (countable.tag !== undefined) {
    dynamic = {counts: 'tag', tag: Array.isArray(countable.tag) ? [...countable.tag] : countable.tag};
  } else {
    for (const key of Object.keys(SIMPLE_COUNTS) as Array<keyof typeof SIMPLE_COUNTS>) {
      if (countable[key] !== undefined) {
        dynamic = {counts: SIMPLE_COUNTS[key]};
        break;
      }
    }
  }
  if (dynamic === undefined) {
    throw new Error('Unsupported countable: ' + JSON.stringify(countable));
  }

  if (countable.others === true) {
    dynamic.scope = 'opponents';
  } else if (countable.all === true) {
    dynamic.scope = 'everyone';
  }
  if (countable.each !== undefined) {
    dynamic.each = countable.each;
  }
  if (countable.per !== undefined) {
    dynamic.per = countable.per;
  }
  if (countable.nextToThis !== undefined) {
    dynamic.next_to_this = true;
  }
  if (countable.includeEvents !== undefined) {
    dynamic.include_events = true;
  }
  return dynamic;
}

/** Translates a card's state-dependent victory points into the exported database's form. */
export function normalizeVictoryPoints(vp: CountableVictoryPoints): Dynamic {
  return normalizeDynamic(vp as _Countable);
}

function amount(countable: Countable): Amount {
  return typeof countable === 'number' ? countable : {dynamic: normalizeDynamic(countable)};
}

function resourceAmounts(units: Partial<CountableUnits>): ResourceAmounts | undefined {
  const amounts: ResourceAmounts = {};
  for (const key of Units.keys) {
    const value = units[key];
    if (value !== undefined) {
      amounts[key] = amount(value);
    }
  }
  return undefinedIfEmpty(amounts);
}

function place(behavior: Behavior): Array<PlaceTile> | undefined {
  const tiles: Array<PlaceTile> = [];
  if (behavior.ocean !== undefined) {
    const tile: PlaceTile = {tile: 'ocean'};
    if (behavior.ocean.count !== undefined) {
      tile.count = behavior.ocean.count;
    }
    if (behavior.ocean.on !== undefined) {
      tile.on = behavior.ocean.on;
    }
    tiles.push(tile);
  }
  if (behavior.city !== undefined) {
    const tile: PlaceTile = {tile: 'city'};
    if (behavior.city.on !== undefined) {
      tile.on = behavior.city.on;
    }
    if (behavior.city.space !== undefined) {
      tile.space = behavior.city.space;
    }
    tiles.push(tile);
  }
  if (behavior.greenery !== undefined) {
    const tile: PlaceTile = {tile: 'greenery'};
    if (behavior.greenery.on !== undefined) {
      tile.on = behavior.greenery.on;
    }
    tiles.push(tile);
  }
  if (behavior.tile !== undefined) {
    if (behavior.tile.adjacencyBonus !== undefined) {
      throw new Error('Unsupported behavior: tile.adjacencyBonus');
    }
    const tile: PlaceTile = {tile: behavior.tile.type, on: behavior.tile.on};
    if (behavior.tile.title !== undefined) {
      tile.title = behavior.tile.title;
    }
    tiles.push(tile);
  }
  return tiles.length === 0 ? undefined : tiles;
}

function addResource(add: Omit<AddResource, 'mustHaveCard'> & {mustHaveCard?: boolean}) {
  const normalized: {
    count: Amount,
    resource?: AddResource['type'],
    tag?: AddResource['tag'],
    exclude_this?: boolean,
    must_have_card?: boolean,
    min?: number,
  } = {count: amount(add.count)};
  if (add.type !== undefined) {
    normalized.resource = add.type;
  }
  if (add.tag !== undefined) {
    normalized.tag = add.tag;
  }
  if (add.excludeThis === true) {
    normalized.exclude_this = true;
  }
  if (add.mustHaveCard === true) {
    normalized.must_have_card = true;
  }
  if (add.min !== undefined) {
    normalized.min = add.min;
  }
  return normalized;
}

function spend(behavior: Behavior): Effect['spend'] {
  const source = behavior.spend;
  if (source === undefined) {
    return undefined;
  }
  if (source.corruption !== undefined) {
    throw new Error('Unsupported behavior: spend.corruption');
  }
  const spent: Effect['spend'] = {};
  for (const key of Units.keys) {
    const value = source[key];
    if (value !== undefined && value !== null) {
      spent[key] = value;
    }
  }
  if (source.resourcesHere !== undefined && source.resourcesHere !== null) {
    spent.resources_here = source.resourcesHere;
  }
  if (source.cards !== undefined && source.cards !== null) {
    spent.cards = source.cards;
  }
  if (source.resourceFromAnyCard !== undefined && source.resourceFromAnyCard !== null) {
    spent.resource_from_any_card = source.resourceFromAnyCard.type;
  }
  const payWith: Array<'steel' | 'titanium'> = [];
  if (source.canUseSteel === true) {
    payWith.push('steel');
  }
  if (source.canUseTitanium === true) {
    payWith.push('titanium');
  }
  if (payWith.length > 0) {
    spent.can_pay_with = payWith;
  }
  return spent;
}

function gain(behavior: Behavior): Effect['gain'] {
  const gained: Effect['gain'] = {...resourceAmounts(behavior.stock ?? {})};
  if (behavior.tr !== undefined) {
    gained.tr = amount(behavior.tr);
  }
  if (behavior.addResources !== undefined) {
    gained.resources_here = amount(behavior.addResources);
  }
  if (behavior.standardResource !== undefined) {
    const standard = behavior.standardResource;
    gained.standard_resource = typeof standard === 'number' ?
      {count: standard, same: true} :
      {count: standard.count, same: standard.same ?? true};
  }
  return undefinedIfEmpty(gained);
}

function draw(behavior: Behavior): Effect['draw'] {
  const source = behavior.drawCard;
  if (source === undefined) {
    return undefined;
  }
  if (typeof source === 'number') {
    return {count: source};
  }
  const drawn: Effect['draw'] = {count: amount(source.count)};
  if (source.keep !== undefined) {
    drawn.keep = source.keep;
  }
  if (source.pay === true) {
    drawn.pay = true;
  }
  if (source.tag !== undefined) {
    drawn.tag = source.tag;
  }
  if (source.type !== undefined) {
    drawn.type = source.type;
  }
  if (source.resource !== undefined) {
    drawn.resource = source.resource;
  }
  return drawn;
}

/**
 * Translates a card's declarative behavior into the exported database's form.
 *
 * Returns undefined when the behavior contributes nothing the database records.
 */
export function normalizeEffect(behavior: Behavior | undefined): Effect | undefined {
  if (behavior === undefined) {
    return undefined;
  }
  for (const key of OUT_OF_SCOPE) {
    if (behavior[key] !== undefined) {
      throw new Error('Unsupported behavior: ' + key);
    }
  }

  const effect: Effect = {};
  const spent = spend(behavior);
  if (spent !== undefined && !isEmpty(spent)) {
    effect.spend = spent;
  }
  if (behavior.lose !== undefined) {
    const lost: {production?: ResourceAmounts, stock?: ResourceAmounts} = {};
    const production = behavior.lose.production;
    const stock = behavior.lose.stock;
    if (production !== undefined && production !== null) {
      lost.production = resourceAmounts(production);
    }
    if (stock !== undefined && stock !== null) {
      lost.stock = resourceAmounts(stock);
    }
    effect.lose = lost;
  }
  const production = resourceAmounts(behavior.production ?? {});
  if (production !== undefined) {
    effect.production = production;
  }
  const gained = gain(behavior);
  if (gained !== undefined) {
    effect.gain = gained;
  }
  const drawn = draw(behavior);
  if (drawn !== undefined) {
    effect.draw = drawn;
  }
  if (behavior.global !== undefined) {
    effect.global = {...behavior.global};
  }
  const tiles = place(behavior);
  if (tiles !== undefined) {
    effect.place = tiles;
  }
  if (behavior.decreaseAnyProduction !== undefined) {
    effect.decrease_any_production = {
      resource: behavior.decreaseAnyProduction.type,
      count: behavior.decreaseAnyProduction.count,
    };
  }
  if (behavior.removeAnyPlants !== undefined) {
    effect.remove_any_plants = behavior.removeAnyPlants;
  }
  if (behavior.addResourcesToAnyCard !== undefined) {
    effect.add_resources_to_any_card = asArray(behavior.addResourcesToAnyCard).map(addResource);
  }
  if (behavior.steelValue !== undefined) {
    effect.steel_value = behavior.steelValue;
  }
  if (behavior.titanumValue !== undefined) {
    effect.titanium_value = behavior.titanumValue;
  }
  if (behavior.greeneryDiscount !== undefined) {
    effect.greenery_discount = behavior.greeneryDiscount;
  }
  if (behavior.or !== undefined) {
    effect.or = behavior.or.behaviors.map((alternative) => ({
      title: alternative.title,
      ...normalizeEffect(alternative),
    }));
  }
  return undefinedIfEmpty(effect);
}
