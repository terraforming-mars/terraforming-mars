import {Player} from '../Player';
import {AndOptions} from '../inputs/AndOptions';
import {SelectAmount} from '../inputs/SelectAmount';
import {DeferredAction, Priority} from './DeferredAction';

export class DryDesertsDeferredAction implements DeferredAction {
  public priority = Priority.DEFAULT;
  constructor(
        public player: Player,
        public count: number = 1,
        public title: string = 'Dry Deserts Global Event - Gain ' + count + ' resource(s) for influence',
  ) {}

  public execute() {
    let megacreditsAmount: number = 0;
    let steelAmount: number = 0;
    let titaniumAmount: number = 0;
    let plantsAmount: number = 0;
    let energyAmount: number = 0;
    let heatAmount: number = 0;

    const selectMegacredit = new SelectAmount('Megacredits', 'Select', (amount: number) => {
      megacreditsAmount = amount;
      return undefined;
    }, 0, this.count);
    const selectSteel = new SelectAmount('Steel', 'Select', (amount: number) => {
      steelAmount = amount;
      return undefined;
    }, 0, this.count);
    const selectTitanium = new SelectAmount('Titanium', 'Select', (amount: number) => {
      titaniumAmount = amount;
      return undefined;
    }, 0, this.count);
    const selectPlants = new SelectAmount('Plants', 'Select', (amount: number) => {
      plantsAmount = amount;
      return undefined;
    }, 0, this.count);
    const selectEnergy = new SelectAmount('Energy', 'Select', (amount: number) => {
      energyAmount = amount;
      return undefined;
    }, 0, this.count);
    const selectHeat = new SelectAmount('Heat', 'Select', (amount: number) => {
      heatAmount = amount;
      return undefined;
    }, 0, this.count);

    const selectResources = new AndOptions(
      () => {
        if (
          megacreditsAmount +
                    steelAmount +
                    titaniumAmount +
                    plantsAmount +
                    energyAmount +
                    heatAmount > this.count
        ) {
          throw new Error('Need to select ' + this.count + ' resource(s)');
        }
        this.player.megaCredits += megacreditsAmount;
        this.player.steel += steelAmount;
        this.player.titanium += titaniumAmount;
        this.player.plants += plantsAmount;
        this.player.energy += energyAmount;
        this.player.heat += heatAmount;
        return undefined;
      },
      selectMegacredit,
      selectSteel,
      selectTitanium,
      selectPlants,
      selectEnergy,
      selectHeat,
    );
    selectResources.title = this.title;

    return selectResources;
  }
}
