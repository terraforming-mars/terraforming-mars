
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { TileType } from "../TileType";
import { SelectSpace } from "../inputs/SelectSpace";
import { SpaceType } from "../SpaceType";
import { ISpace } from "../ISpace";

export class Capital implements IProjectCard {
    public cost: number = 26;
    public nonNegativeVPIcon: boolean = true;
    public tags: Array<Tags> = [Tags.CITY, Tags.STEEL];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Capital";
    public text: string = "Requires 4 ocean tiles. Place a special city tile. Decrease your energy production 2 steps and increase your mega credit production 5 steps. Gain 1 additional victory point for each ocean tile adjacent to this city tile.";
    public description: string = "With its ideal placement and all its facilities, this is the true capital of Mars.";
    public canPlay(player: Player, game: Game): boolean {
        return game.getOceansOnBoard() >= 4 - player.getRequirementsBonus(game) && player.energyProduction >= 2 && game.getAvailableSpacesOnLand(player).length >= 0;
    }
    public onGameEnd(player: Player, game: Game) {
        const usedSpace = game.getSpaceByTileCard(this.name);
        if (usedSpace !== undefined) { 
            player.victoryPoints += game.getAdjacentSpaces(usedSpace)
                                        .filter((s) => s.tile !== undefined && s.tile.tileType === TileType.OCEAN).length;
        }
    }
    public play(player: Player, game: Game) {
        player.energyProduction -= 2;
        player.megaCreditProduction += 5;
        return new SelectSpace("Select space for special city tile", game.getAvailableSpacesOnLand(player), (space: ISpace) => {
            game.addCityTile(player, space.id, SpaceType.LAND, this.name);
            return undefined;
        });
    }
}
