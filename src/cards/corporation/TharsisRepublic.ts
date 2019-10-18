
import { CorporationCard } from "./CorporationCard";
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { SelectSpace } from "../../inputs/SelectSpace";
import { SpaceType } from "../../SpaceType";
import { ISpace } from "../../ISpace";
import { TileType } from "../../TileType";

export class TharsisRepublic implements CorporationCard {
    public name: string = "Tharsis Republic";
    public tags: Array<Tags> = [Tags.STEEL];
    public startingMegaCredits: number = 40;
    public text: string = "As your first action in the game, place a city tile. When any city tile is placed on mars, increase your mega credit production 1 step. When you place a city tile, gain 3 mega credits.";
    public description: string = "With the first big city came a social community that could not be controlled by the corporations. Determined to have an elected leader, workers and staff from all corporations formed Tharsis Republic.";
    public initialAction(player: Player, game: Game) {
        return new SelectSpace("Select space on mars for city tile", game.getAvailableSpacesOnLand(player), (space: ISpace) => {
            game.addCityTile(player, space.id);
            return undefined;
        });
    }
    public onTilePlaced(player: Player, space: ISpace) {
        if (space.tile !== undefined && space.tile.tileType === TileType.CITY) {
            if (space.player === player) {
                player.megaCredits += 3;
            }
            if (space.spaceType !== SpaceType.COLONY) {
                player.megaCreditProduction++;
            }
        }
    }
    public play(player: Player, game: Game) {
        if (game.getPlayers().length == 1) {
            // Get bonus for 2 neutral cities
            player.megaCreditProduction =+ 2;
        }	
        return undefined;
    }
}
