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

    public initialAction(player: Player, game: Game) {
        return new SelectSpace("Select space for greenery tile", 
        game.board.getAvailableSpacesForGreenery(player), (space: ISpace) => {
            game.addGreenery(player, space.id);
            return undefined;
        });
    }

    private selectResources(player: Player, game: Game, resourceCount: number) {
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
          }, resourceCount);
          const selectSteel = new SelectAmount("Steel", (amount: number) => {
            steelAmount = amount;
            return undefined;
          }, resourceCount); 
          const selectTitanium = new SelectAmount("Titanium", (amount: number) => {
            titaniumAmount = amount;
            return undefined;
          }, resourceCount);
          const selectPlants = new SelectAmount("Plants", (amount: number) => {
            plantsAmount = amount;
            return undefined;
          }, resourceCount);
          const selectEnergy = new SelectAmount("Energy", (amount: number) => {
            energyAmount = amount;
            return undefined;
          }, resourceCount);
          const selectHeat = new SelectAmount("Heat", (amount: number) => {
            heatAmount = amount;
            return undefined;
          }, resourceCount);
        selectResources = new AndOptions(
            () => {
                if (
                    megacreditsAmount +
                    steelAmount +
                    titaniumAmount +
                    plantsAmount +
                    energyAmount +
                    heatAmount > resourceCount
                  ) {
                    throw new Error("Need to select " + resourceCount + " resource(s)");
                  }
                  player.megaCredits += megacreditsAmount;
                  player.steel += steelAmount;
                  player.titanium += titaniumAmount;
                  player.plants += plantsAmount;
                  player.energy += energyAmount;
                  player.heat += heatAmount;
                  return undefined;
            }, selectMegacredit, selectSteel, selectTitanium, selectPlants, selectEnergy, selectHeat);
        selectResources.title = "Philares effect: select " + resourceCount + " resource(s)";
        game.interrupts.push({
            player: player,
            playerInput: selectResources
        });
    }

    public onTilePlaced(player: Player, space: ISpace, game: Game): void {
        if (space.tile !== undefined && space.tile.tileType !== TileType.OCEAN) {
          let bonusResource: number = 0;
          if (space.player !== undefined && space.player.isCorporation(CorporationName.PHILARES)) {
            bonusResource = game.board.getAdjacentSpaces(space)
                .filter((space) => space.tile !== undefined && space.player !== undefined && space.player !== player)
                .length;
          } else if (space.player !== undefined && !space.player.isCorporation(CorporationName.PHILARES)) {
            bonusResource = game.board.getAdjacentSpaces(space)
                .filter((space) => space.tile !== undefined && space.player !== undefined && space.player.isCorporation(CorporationName.PHILARES))
                .length;
          }
          if (bonusResource > 0) {
            const philaresPlayer = game.getPlayers().filter((player) => player.isCorporation(CorporationName.PHILARES))[0];
            this.selectResources(philaresPlayer, game, bonusResource);
          }
        }
    }

    public play() {
        return undefined;
    }
}
