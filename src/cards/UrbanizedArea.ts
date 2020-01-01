
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { TileType } from "../TileType";
import { ISpace } from "../ISpace";
import { SelectSpace } from "../inputs/SelectSpace";
import { Resources } from '../Resources';

export class UrbanizedArea implements IProjectCard {
    public cost: number = 10;
    public tags: Array<Tags> = [Tags.CITY, Tags.STEEL];
    public name: string = "Urbanized Area";
    public cardType: CardType = CardType.AUTOMATED;
    private getAvailableSpaces(player: Player, game: Game): Array<ISpace> {
        return game.getAvailableSpacesOnLand(player)
                .filter((space) => game.getAdjacentSpaces(space).filter((adjacentSpace) => adjacentSpace.tile !== undefined && adjacentSpace.tile.tileType === TileType.CITY).length >= 2);
    }
    public canPlay(player: Player, game: Game): boolean {
        return player.getProduction(Resources.ENERGY) >= 1 && this.getAvailableSpaces(player, game).length > 0;
    }
    public play(player: Player, game: Game) {
        return new SelectSpace("Select space next to at least 2 other city tiles", this.getAvailableSpaces(player, game), (foundSpace: ISpace) => {
            game.addCityTile(player, foundSpace.id);
            player.setProduction(Resources.ENERGY,-1);
            player.megaCreditProduction += 2;
            return undefined;
        });
    }
}
