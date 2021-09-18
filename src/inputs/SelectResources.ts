import {Player} from '../Player';
import {AndOptions} from './AndOptions';
import {SelectAmount} from './SelectAmount';
import {Units} from '../Units';

export class SelectResources extends AndOptions {
  private static makeOptions(count: number, units: Units) {
    const selectMegacredit = new SelectAmount('Megacredits', 'Select', (amount: number) => {
      units.megacredits = amount;
      return undefined;
    }, 0, count);
    const selectSteel = new SelectAmount('Steel', 'Select', (amount: number) => {
      units.steel = amount;
      return undefined;
    }, 0, count);
    const selectTitanium = new SelectAmount('Titanium', 'Select', (amount: number) => {
      units.titanium = amount;
      return undefined;
    }, 0, count);
    const selectPlants = new SelectAmount('Plants', 'Select', (amount: number) => {
      units.plants = amount;
      return undefined;
    }, 0, count);
    const selectEnergy = new SelectAmount('Energy', 'Select', (amount: number) => {
      units.energy = amount;
      return undefined;
    }, 0, count);
    const selectHeat = new SelectAmount('Heat', 'Select', (amount: number) => {
      units.heat = amount;
      return undefined;
    }, 0, count);
    return [selectMegacredit, selectSteel, selectTitanium, selectPlants, selectEnergy, selectHeat];
  }
  constructor(
    public player: Player,
    public count: number,
    public title: string,
    private units = Units.of({})) {
    super(
      () => {
        const array = [
          units.megacredits,
          units.steel,
          units.titanium,
          units.plants,
          units.energy,
          units.heat];
        if (array.find((count) => count < 0)) {
          throw new Error('No resource amount may be negative.');
        }
        const sum = array.reduce((a, b) => a + b, 0);
        if (sum !== this.count) {
          throw new Error(`Select ${this.count} resources.`);
        }

        this.player.addUnits(this.units, {log: true});
        return undefined;
      },
      ...SelectResources.makeOptions(count, units),
    );
  }
}
