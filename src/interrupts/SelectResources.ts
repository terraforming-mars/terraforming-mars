import { Game } from "../Game";
import { PlayerInput } from "../PlayerInput";
import { Player } from "../Player";
import { PlayerInterrupt } from "./PlayerInterrupt";
import { AndOptions } from "../inputs/AndOptions";
import { SelectAmount } from "../inputs/SelectAmount";

export class SelectResources implements PlayerInterrupt {
    public playerInput?: PlayerInput;
    constructor(
        public player: Player,
        public game: Game,
        public count: number = 1,
        public title: string = "Select " + count + " resource(s)"
    ){}

    public generatePlayerInput() {
        let megacreditsAmount: number = 0;
        let steelAmount: number = 0;
        let titaniumAmount: number = 0;
        let plantsAmount: number = 0;
        let energyAmount: number = 0;
        let heatAmount: number = 0;
        let selectResources: AndOptions;
        const selectMegacredit = new SelectAmount("Megacredits", "Select", (amount: number) => {
            megacreditsAmount = amount;
            return undefined;
          }, this.count);
          const selectSteel = new SelectAmount("Steel", "Select",  (amount: number) => {
            steelAmount = amount;
            return undefined;
          }, this.count); 
          const selectTitanium = new SelectAmount("Titanium", "Select", (amount: number) => {
            titaniumAmount = amount;
            return undefined;
          }, this.count);
          const selectPlants = new SelectAmount("Plants", "Select",  (amount: number) => {
            plantsAmount = amount;
            return undefined;
          }, this.count);
          const selectEnergy = new SelectAmount("Energy", "Select",  (amount: number) => {
            energyAmount = amount;
            return undefined;
          }, this.count);
          const selectHeat = new SelectAmount("Heat", "Select",  (amount: number) => {
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
                  this.player.megaCredits += megacreditsAmount;
                  this.player.steel += steelAmount;
                  this.player.titanium += titaniumAmount;
                  this.player.plants += plantsAmount;
                  this.player.energy += energyAmount;
                  this.player.heat += heatAmount;
                  return undefined;
            }, selectMegacredit, selectSteel, selectTitanium, selectPlants, selectEnergy, selectHeat);
        selectResources.title = this.title;

        this.playerInput = selectResources;
    }
}    
