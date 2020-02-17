import { CorporationCard } from "../corporation/CorporationCard";
import { Player } from "../../Player";
import { Tags } from "../Tags";
import { CorporationName } from '../../CorporationName';
import { Game } from '../../Game';
import { SelectSpace } from "../../inputs/SelectSpace";
import { ISpace } from '../../ISpace';
import { TileType } from '../../TileType';
import { SelectAmount } from '../../inputs/SelectAmount';
import { AndOptions } from '../../inputs/AndOptions';


export class Philares implements CorporationCard {
    public name: string = CorporationName.PHILARES;
    public tags: Array<Tags> = [Tags.STEEL];
    public startingMegaCredits: number = 47;
    private pendingResourcesToAdd : number = 0;


    public initialAction(player: Player, game: Game) {
        return new SelectSpace("Select space for greenery tile", 
        game.board.getAvailableSpacesForGreenery(player), (space: ISpace) => {
            game.addGreenery(player, space.id);
            return undefined;
        });
    }

    private selectResources(player: Player, game: Game) {

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
          }, this.pendingResourcesToAdd); 
          const selectSteel = new SelectAmount("Steel", (amount: number) => {
            steelAmount = amount;
            return undefined;
          }, this.pendingResourcesToAdd); 
          const selectTitanium = new SelectAmount("Titanium", (amount: number) => {
            titaniumAmount = amount;
            return undefined;
          }, this.pendingResourcesToAdd);
          const selectPlants = new SelectAmount("Plants", (amount: number) => {
            plantsAmount = amount;
            return undefined;
          }, this.pendingResourcesToAdd);
          const selectEnergy = new SelectAmount("Energy", (amount: number) => {
            energyAmount = amount;
            return undefined;
          }, this.pendingResourcesToAdd);
          const selectHeat = new SelectAmount("Heat", (amount: number) => {
            heatAmount = amount;
            return undefined;
          }, this.pendingResourcesToAdd);
        selectResources = new AndOptions(
            () => {
                if (
                    megacreditsAmount +
                    steelAmount +
                    titaniumAmount +
                    plantsAmount +
                    energyAmount +
                    heatAmount > this.pendingResourcesToAdd
                  ) {
                    throw new Error("Need to select "+ this.pendingResourcesToAdd +" resource(s)");
                  }
                  player.megaCredits += megacreditsAmount;
                  player.steel += steelAmount;
                  player.titanium += titaniumAmount;
                  player.plants += plantsAmount;
                  player.energy += energyAmount;
                  player.heat += heatAmount;
                  return undefined;
            }, selectMegacredit, selectSteel, selectTitanium, selectPlants, selectEnergy, selectHeat);
        selectResources.title = "Philares effect : select "+ this.pendingResourcesToAdd +" resource(s)";
        let philaresPlayer = game.getPlayers().filter((player) => player.isCorporation(CorporationName.PHILARES))[0];
        selectResources.onend = () => { 
            this.pendingResourcesToAdd = 0;
            if (philaresPlayer !== player) {
                game.playerIsFinishedTakingActions();   
            } else {
                player.takeAction(game);
            }
        };

        let interrupt = {
            player: philaresPlayer,
            playerInput: selectResources
        };
        game.interrupts.push(interrupt);
    }

    public onTilePlaced(player: Player, space: ISpace, game: Game) {
        if (space.tile !== undefined && space.tile.tileType !== TileType.OCEAN) {
          let bonusResource: number = game.board.getAdjacentSpaces(space)
          .filter((space) => space.tile !== undefined && space.player !== undefined && space.player !== player 
          && (space.player.isCorporation(CorporationName.PHILARES) || player.isCorporation(CorporationName.PHILARES))
          ).length;
          this.pendingResourcesToAdd += bonusResource;
          this.selectResources(player, game);
        }
    }

    public play() {
        return undefined;
    }

}