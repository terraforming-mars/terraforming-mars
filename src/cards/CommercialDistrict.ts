
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { TileType } from "../TileType";
import { SelectSpace } from "../inputs/SelectSpace";
import { ISpace } from "../ISpace";

export class CommercialDistrict implements IProjectCard {
    public cost: number = 16;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "Commercial District";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Decrease your energy production 1 step and increase your mega credit production 4 steps. Place a special tile. Gain 1 victory point per adjacent city tile.";
    public description: string = "Taking advantage of dense population centers.";
    public canPlay(player: Player): boolean {
        return player.energyProduction >= 1;
    }
    public onGameEnd(player: Player, game: Game) {
        const usedSpace = game.getSpaceByTileCard(this.name);
        if (usedSpace !== undefined) {
            player.victoryPoints += game.getAdjacentSpaces(usedSpace).filter((adjacentSpace) => adjacentSpace.tile && adjacentSpace.tile.tileType === TileType.CITY).length;
        }
    }
    public play(player: Player, game: Game) {
        return new SelectSpace("Select space for special tile", game.getAvailableSpacesOnLand(player), (foundSpace: ISpace) => {
            game.addTile(player, foundSpace.spaceType, foundSpace, { tileType: TileType.SPECIAL, card: this.name });
            player.energyProduction--;
            player.megaCreditProduction += 4;
            return undefined;
        });
    }
}

