// A representation of a value associated with each standard resource type.
// Could be a player's inventory, or their production, or just a way to pass several resource-related values

// import {Player} from './Player';

// Units represents any value of each standard unit.
// Could be positive or negative, depending on how it's used.
export interface Units {
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
  };

  export const keys = Object.keys(EMPTY) as (keyof Units)[];

  export function isUnits(arg: any): arg is Units {
    if (typeof arg !== 'object') return false;
    return keys.every((key) =>
      typeof arg[key] === 'number' && !isNaN(arg[key]));
  }

  // Converts partial units to a full Units, allowing code to use a Units stricture,
  // reducing the need to check for undefined everywhere.
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

  export function negative(units: Units): Units {
    return {
      megacredits: -units.megacredits,
      steel: -units.steel,
      titanium: -units.titanium,
      plants: -units.plants,
      energy: -units.energy,
      heat: -units.heat,
    };
  }

  export function isEmpty(u: Partial<Units> | undefined): boolean {
    if (u === undefined) return true;
    return (u.megacredits ?? 0) === 0 &&
      (u.steel ?? 0) === 0 &&
      (u.titanium ?? 0) === 0 &&
      (u.plants ?? 0) === 0 &&
      (u.energy ?? 0) === 0 &&
      (u.heat ?? 0) === 0;
  }
}
