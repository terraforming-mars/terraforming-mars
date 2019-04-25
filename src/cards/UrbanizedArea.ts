
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { TileType } from "../TileType";
import { ISpace } from "../ISpace";
import { SelectSpace } from "../inputs/SelectSpace";

export class UrbanizedArea implements IProjectCard {
    public cost: number = 10;
    public tags: Array<Tags> = [Tags.CITY, Tags.STEEL];
    public name: string = "Urbanized Area";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Decrease your energy production 1 step and increase your mega credit production 2 steps. Place a city tile adjacent to at least 2 other city tiles.";
    public description: string = "When the population begins to soar, cities will eventually merge into large urban areas.";
    private getAvailableSpaces(player: Player, game: Game): Array<ISpace> {
        return game.getAvailableSpacesOnLand(player)
                .filter((space) => game.getAdjacentSpaces(space).filter((adjacentSpace) => adjacentSpace.tile !== undefined && adjacentSpace.tile.tileType === TileType.CITY).length >= 2);
    }
    public canPlay(player: Player, game: Game): boolean {
        return player.energyProduction >= 1 && this.getAvailableSpaces(player, game).length > 0;
    }
    public play(player: Player, game: Game) {
        if (player.energyProduction < 1) {
            throw "Must have energy production";
        }
        return new SelectSpace(this.name, "Select space next to at least 2 other city tiles", this.getAvailableSpaces(player, game), (foundSpace: ISpace) => {
            game.addCityTile(player, foundSpace.id);
            player.energyProduction--;
            player.megaCreditProduction += 2;
            return undefined;
        });
    }
}
