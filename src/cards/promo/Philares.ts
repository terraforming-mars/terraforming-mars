import { CorporationCard } from "../corporation/CorporationCard";
import { Player } from "../../Player";
import { Tags } from "../Tags";
import { CorporationName } from '../../CorporationName';
import { Game, PlayerInterrupt } from '../../Game';
import { SelectSpace } from "../../inputs/SelectSpace";
import { ISpace } from '../../ISpace';
import { TileType } from '../../TileType';
import { SelectAmount } from '../../inputs/SelectAmount';
import { AndOptions } from '../../inputs/AndOptions';


export class Philares implements CorporationCard {
    public name: string = CorporationName.PHILARES;
    public tags: Array<Tags> = [Tags.STEEL];
    public startingMegaCredits: number = 47;

    public initialAction(player: Player, game: Game) {
        return new SelectSpace("Select space for greenery tile", 
        game.board.getAvailableSpacesForGreenery(player), (space: ISpace) => {
            game.addGreenery(player, space.id);
            return undefined;
        });
    }

    private selectResources(player: Player, resourceAmount: number, game: Game) {
        // Check if interrupt is already set, and if so, update it
        if(game.interrupt !== undefined) {
            resourceAmount += game.interrupt.resourceAmount;
        }
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
          }, resourceAmount); 
          const selectSteel = new SelectAmount("Steel", (amount: number) => {
            steelAmount = amount;
            return undefined;
          }, resourceAmount); 
          const selectTitanium = new SelectAmount("Titanium", (amount: number) => {
            titaniumAmount = amount;
            return undefined;
          }, resourceAmount);
          const selectPlants = new SelectAmount("Plants", (amount: number) => {
            plantsAmount = amount;
            return undefined;
          }, resourceAmount);
          const selectEnergy = new SelectAmount("Energy", (amount: number) => {
            energyAmount = amount;
            return undefined;
          }, resourceAmount);
          const selectHeat = new SelectAmount("Heat", (amount: number) => {
            heatAmount = amount;
            return undefined;
          }, resourceAmount);
        selectResources = new AndOptions(
            () => {
                if (
                    megacreditsAmount +
                    steelAmount +
                    titaniumAmount +
                    plantsAmount +
                    energyAmount +
                    heatAmount > resourceAmount
                  ) {
                    throw new Error("Need to select "+ resourceAmount +" resource(s)");
                  }
                  player.megaCredits += megacreditsAmount;
                  player.steel += steelAmount;
                  player.titanium += titaniumAmount;
                  player.plants += plantsAmount;
                  player.energy += energyAmount;
                  player.heat += heatAmount;
                  return undefined;
            }, selectMegacredit, selectSteel, selectTitanium, selectPlants, selectEnergy, selectHeat);
        selectResources.title = "Philares effect : select "+ resourceAmount +" resource(s)";
        let philaresPlayer = game.getPlayers().filter((player) => player.isCorporation(CorporationName.PHILARES))[0];
        selectResources.onend = () => { 
            game.interrupt = undefined;
            if (philaresPlayer !== player) {
                game.playerIsFinishedTakingActions(player);   
            } else {
                player.takeAction(game);
            }
        };
        game.interrupt = {
            player: philaresPlayer,
            playerInput: selectResources,
            resourceAmount: resourceAmount
        };
    }

    public onTilePlaced(player: Player, space: ISpace, game: Game) {
        if (space.tile !== undefined && space.tile.tileType !== TileType.OCEAN) {
          let bonusResource: number = game.board.getAdjacentSpaces(space)
          .filter((space) => space.tile !== undefined && space.player !== undefined && space.player !== player 
          && (space.player.isCorporation(CorporationName.PHILARES) || player.isCorporation(CorporationName.PHILARES))
          ).length;
          this.selectResources(player,bonusResource, game);
        }
    }

    public play() {
        return undefined;
    }

}