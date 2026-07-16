// A representation of a value associated with each standard resource type.
// Could be a player's inventory, or their production, or just a way to pass several resource-related values

import {Resource} from './Resource';

// Units represents any value of each standard unit.
// Could be positive or negative, depending on how it's used.
export type Units = {
  megacredits: number;
  steel: number;
  titanium: number;
  plants: number;
  energy: number;
  heat: number;
}

export namespace Units {
  export const EMPTY: Readonly<Units> = {
    get megacredits() {
      return 0;
    },
    get steel() {
      return 0;
    },
    get titanium() {
      return 0;
    },
    get plants() {
      return 0;
    },
    get energy() {
      return 0;
    },
    get heat() {
      return 0;
    },
  } as const;

  export const keys: ReadonlyArray<keyof Units> = Object.keys(EMPTY) as (keyof Units)[];

  /**
   * Returns true when all six units fields exist in `arg` and each represents a valid number.
   */
  export function isUnits(arg: any): arg is Units {
    if (typeof arg !== 'object') return false;
    return keys.every((key) =>
      typeof arg[key] === 'number' && !isNaN(arg[key]));
  }

  /**
   * Converts partial units to a full Units, allowing code to use a Units structure,
   * reducing the need to check for undefined everywhere.
   */
  export function of(partialUnits: Partial<Units>): Units {
    return {
      megacredits: partialUnits.megacredits === undefined ? 0 : partialUnits.megacredits,
      steel: partialUnits.steel === undefined ? 0 : partialUnits.steel,
      titanium: partialUnits.titanium === undefined ? 0 : partialUnits.titanium,
      plants: partialUnits.plants === undefined ? 0 : partialUnits.plants,
      energy: partialUnits.energy === undefined ? 0 : partialUnits.energy,
      heat: partialUnits.heat === undefined ? 0 : partialUnits.heat,
    };
  }

  /**
   * Returns the units, with every value inverted.
   */
  export function negative(units: Units): Units {
    // "-0" is a different value than "0" in Javascript.
    // This prefvents -0.
    const neg = (n: number) => n === 0 ? 0 : -n;

    return {
      megacredits: neg(units.megacredits),
      steel: neg(units.steel),
      titanium: neg(units.titanium),
      plants: neg(units.plants),
      energy: neg(units.energy),
      heat: neg(units.heat),
    };
  }

  /**
   * Returns `true` when every unit is 0, undefined, or absent.
   */
  export function isEmpty(u: Partial<Units> | undefined): boolean {
    if (u === undefined) return true;
    return (u.megacredits ?? 0) === 0 &&
      (u.steel ?? 0) === 0 &&
      (u.titanium ?? 0) === 0 &&
      (u.plants ?? 0) === 0 &&
      (u.energy ?? 0) === 0 &&
      (u.heat ?? 0) === 0;
  }

  /**
   * Returns an instance of `Partial<Units>` where any value of 0 or undefined is not in the final object.
   * This can be used, for instance, to reduce the amount of information sent over the wire.
   */
  export function partial(u: Partial<Units>) : Partial<Units> {
    const partial: Partial<Units> = {};
    for (const key of keys) {
      const value = u[key];
      if (value) {
        partial[key] = value;
      }
    }
    return partial;
  }

  /**
   * Returns an array of 6 elements representing the unit value in unit order.
   *
   * In other words, it returns an array of
   * [MC, steel, titanium, plants, energy, heat].
   *
   */
  export function values(u: Units): ReadonlyArray<number> {
    return keys.map((k) => u[k]);
  }

  export const ResourceMap: Record<keyof Units, Resource> = {
    megacredits: Resource.MEGACREDITS,
    steel: Resource.STEEL,
    titanium: Resource.TITANIUM,
    plants: Resource.PLANTS,
    energy: Resource.ENERGY,
    heat: Resource.HEAT,
  } as const;
}
