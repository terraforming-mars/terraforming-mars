// A representation of a value associated with each standard resource type.
// Could be a player's inventory, or their production, or just a way to pass several resource-related values

import {Game} from './Game';
import {Player} from './Player';
import {Resources} from './Resources';

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
  // // Options used when logging changes in units.
  // export interface Options {
  //   dueTo?: Player;
  //   globalEvent?: boolean;
  //   log?: boolean;
  // };

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

  // export function adjustUnits(delta: PartialUnits, player: Player, purse: Units) {
  //   if (!player.hasUnits(delta)) {
  //     throw new Error();
  //   }
  //   purse.megacredits += delta.megacredits || 0;
  //   purse.steel += delta.steel || 0;
  //   purse.titanium += delta.titanium || 0;
  //   purse.plants += delta.plants || 0;
  //   purse.energy += delta.energy || 0;
  //   purse.heat += delta.heat || 0;
  // }

  // Returns true when the player has the supplied units in its inventory.
  export function hasUnits(units: Units, player:Player): boolean {
    return player.megaCredits - units.megacredits >= 0 &&
      player.steel - units.steel >= 0 &&
      player.titanium - units.titanium >= 0 &&
      player.plants - units.plants >= 0 &&
      player.energy - units.energy >= 0 &&
      player.heat - units.heat >= 0;
  }

  export function deductUnits(units: Units, player: Player) {
    player.megaCredits -= units.megacredits;
    player.steel -= units.steel;
    player.titanium -= units.titanium;
    player.plants -= units.plants;
    player.energy -= units.energy;
    player.heat -= units.heat;
  }

  export function canAdjustProduction(units: Units, player: Player): boolean {
    return player.getProduction(Resources.MEGACREDITS) + units.megacredits >= -5 &&
      player.getProduction(Resources.STEEL) + units.steel >= 0 &&
      player.getProduction(Resources.TITANIUM) + units.titanium >= 0 &&
      player.getProduction(Resources.PLANTS) + units.plants >= 0 &&
      player.getProduction(Resources.ENERGY) + units.energy >= 0 &&
      player.getProduction(Resources.HEAT) + units.heat >= 0;
  }

  export function adjustProduction(units: Units, player: Player, game?: Game, fromPlayer?: Player) {
    if (units.megacredits !== undefined) {
      player.addProduction(Resources.MEGACREDITS, units.megacredits, game, fromPlayer);
    }

    if (units.steel !== undefined) {
      player.addProduction(Resources.STEEL, units.steel, game, fromPlayer);
    }

    if (units.titanium !== undefined) {
      player.addProduction(Resources.TITANIUM, units.titanium, game, fromPlayer);
    }

    if (units.plants !== undefined) {
      player.addProduction(Resources.PLANTS, units.plants, game, fromPlayer);
    }

    if (units.energy !== undefined) {
      player.addProduction(Resources.ENERGY, units.energy, game, fromPlayer);
    }

    if (units.heat !== undefined) {
      player.addProduction(Resources.HEAT, units.heat, game, fromPlayer);
    }
  }
}
