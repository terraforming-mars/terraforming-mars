import {IPlayer} from '../IPlayer';
import {AndOptions} from './AndOptions';
import {SelectAmount} from './SelectAmount';
import {Units} from '../../common/Units';
import {sum} from '../../common/utils/utils';

export class SelectResources extends AndOptions {
  private static makeOptions(count: number, units: Units) {
    const selectMegacredits = new SelectAmount('Megacredits', 'Select', (amount: number) => {
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
    return [selectMegacredits, selectSteel, selectTitanium, selectPlants, selectEnergy, selectHeat];
  }
  constructor(
    public player: IPlayer,
    public count: number,
    public override title: string,
    // this isn't actually used as a paramteter, but  this class
    // is kind of strangely structured. If you can refactor this,
    // please do.
    private units = Units.of({})) {
    super(
      () => {
        const array = Object.values(units);
        if (array.some((count) => count < 0)) {
          throw new Error('All units must be positive');
        }
        if (sum(array) !== this.count) {
          throw new Error(`Select ${this.count} resources.`);
        }

        this.player.stock.addUnits(this.units, {log: true});
        return undefined;
      },
      ...SelectResources.makeOptions(count, units),
    );
  }
}
