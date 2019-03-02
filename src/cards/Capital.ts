
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { TileType } from "../TileType";
import { SelectSpace } from "../inputs/SelectSpace";
import { ISpace } from "../ISpace";

export class Capital implements IProjectCard {
    public cost: number = 26;
    public tags: Array<Tags> = [Tags.CITY, Tags.STEEL];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Capital";
    public text: string = "Requires 4 ocean tiles. Place a special city tile. Decrease your energy production 2 steps and increase your mega credit production 5 steps. Gain 1 additional victory point for each ocean tile adjacent to this city tile.";
    public description: string = "With its ideal placement and all its facilities, this is the true capital of Mars.";
    public play(player: Player, game: Game) {
        if (game.getOceansOnBoard() < 4) {
            throw "Requires 4 ocean tiles.";
        }
        if (player.energyProduction < 2) {
            throw "Requires 2 energy production.";
        }
        player.energyProduction -= 2;
        player.megaCreditProduction += 5;
        return new SelectSpace(this.name, "Select space for special city tile", game.getAvailableSpacesOnLand(player), (space: ISpace) => {
            game.addCityTile(player, space.id);
            game.addGameEndListener(() => {
                player.victoryPoints += game.getAdjacentSpaces(space)
                    .filter((s) => s.tile !== undefined && s.tile.tileType === TileType.OCEAN).length;
            });
            return undefined;
        });
    }
}
