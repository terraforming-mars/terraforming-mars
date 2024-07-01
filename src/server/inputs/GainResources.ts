import {IPlayer} from '../IPlayer';
import {AndOptions} from './AndOptions';
import {SelectAmount} from './SelectAmount';
import {Units} from '../../common/Units';
import {sum} from '../../common/utils/utils';
import {Message} from '../../common/logs/Message';
import {InputError} from './InputError';

export class GainResources extends AndOptions {
  private static makeOptions(count: number, units: Units) {
    const selectMegacredits = new SelectAmount('Megacredits', 'Select', 0, count)
      .andThen((amount) => {
        units.megacredits = amount;
        return undefined;
      });
    const selectSteel = new SelectAmount('Steel', 'Select', 0, count)
      .andThen((amount) => {
        units.steel = amount;
        return undefined;
      });
    const selectTitanium = new SelectAmount('Titanium', 'Select', 0, count)
      .andThen((amount) => {
        units.titanium = amount;
        return undefined;
      });
    const selectPlants = new SelectAmount('Plants', 'Select', 0, count)
      .andThen((amount) => {
        units.plants = amount;
        return undefined;
      });
    const selectEnergy = new SelectAmount('Energy', 'Select', 0, count)
      .andThen((amount) => {
        units.energy = amount;
        return undefined;
      });
    const selectHeat = new SelectAmount('Heat', 'Select', 0, count)
      .andThen((amount) => {
        units.heat = amount;
        return undefined;
      });
    return [selectMegacredits, selectSteel, selectTitanium, selectPlants, selectEnergy, selectHeat];
  }
  constructor(
    public player: IPlayer,
    public count: number,
    public override title: string | Message,
    // this isn't actually used as a paramteter, but  this class
    // is kind of strangely structured. If you can refactor this,
    // please do.
    private units = Units.of({})) {
    super(...GainResources.makeOptions(count, units));
    this.andThen(() => {
      const array = Object.values(units);
      if (array.some((count) => count < 0)) {
        throw new InputError('All units must be positive');
      }
      if (sum(array) !== this.count) {
        throw new InputError(`Select ${this.count} resource(s)`);
      }

      this.player.stock.addUnits(this.units, {log: true});
      return undefined;
    });
  }
}
