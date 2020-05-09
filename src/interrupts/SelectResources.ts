import { Game } from '../Game';
import { PlayerInput } from '../PlayerInput';
import { Player } from '../Player';
import { PlayerInterrupt } from './PlayerInterrupt';
import { AndOptions } from '../inputs/AndOptions';
import { SelectAmount } from '../inputs/SelectAmount';

export class SelectResources implements PlayerInterrupt {
    public playerInput: PlayerInput;
    constructor(
        public player: Player,
        public game: Game,
        public count: number = 1,
        public title: string = "Select " + count + " resource(s)"
    ){
        let megacreditsAmount: number = 0;
        let steelAmount: number = 0;
        let titaniumAmount: number = 0;
        let plantsAmount: number = 0;
        let energyAmount: number = 0;
        let heatAmount: number = 0;
        let selectResources: AndOptions;
        const selectMegacredit = new SelectAmount("Megacredits", (amount: number) => {
            megacreditsAmount = amount;
            return undefined;
          }, this.count);
          const selectSteel = new SelectAmount("Steel", (amount: number) => {
            steelAmount = amount;
            return undefined;
          }, this.count); 
          const selectTitanium = new SelectAmount("Titanium", (amount: number) => {
            titaniumAmount = amount;
            return undefined;
          }, this.count);
          const selectPlants = new SelectAmount("Plants", (amount: number) => {
            plantsAmount = amount;
            return undefined;
          }, this.count);
          const selectEnergy = new SelectAmount("Energy", (amount: number) => {
            energyAmount = amount;
            return undefined;
          }, this.count);
          const selectHeat = new SelectAmount("Heat", (amount: number) => {
            heatAmount = amount;
            return undefined;
          }, this.count);
        selectResources = new AndOptions(
            () => {
                if (
                    megacreditsAmount +
                    steelAmount +
                    titaniumAmount +
                    plantsAmount +
                    energyAmount +
                    heatAmount > this.count
                  ) {
                    throw new Error("Need to select " + this.count + " resource(s)");
                  }
                  player.megaCredits += megacreditsAmount;
                  player.steel += steelAmount;
                  player.titanium += titaniumAmount;
                  player.plants += plantsAmount;
                  player.energy += energyAmount;
                  player.heat += heatAmount;
                  return undefined;
            }, selectMegacredit, selectSteel, selectTitanium, selectPlants, selectEnergy, selectHeat);
        selectResources.title = this.title;
        this.playerInput = selectResources;
    };
}    
