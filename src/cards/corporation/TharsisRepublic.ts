
import { CorporationCard } from "./CorporationCard";
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { SelectSpace } from "../../inputs/SelectSpace";
import { SpaceType } from "../../SpaceType";
import { ISpace } from "../../ISpace";

export class TharsisRepublic extends CorporationCard {
    public name: string = "Tharsis Republic";
    public tags: Array<Tags> = [Tags.STEEL];
    public startingMegaCredits: number = 40;
    public text: string = "As your first action in the game, place a city tile.";
    public effect: string = "When any city tile is placed on mars, increase your mega credit production 1 step. When you place a city tile, gain 3 mega credits.";
    public description: string = "With the first big city came a social community that could not be controlled by the corporations. Determined to have an elected leader, workers and staff from all corporations formed Tharsis Republic.";
    public play(player: Player, game: Game): Promise<void> {
        game.addCityTilePlacedListener((space: ISpace) => {
            if (space.player === player) {
                player.megaCredits += 3;
            }
            if (space.spaceType !== SpaceType.COLONY) {
                player.megaCreditProduction++;
            }
        });
        return new Promise((resolve, reject) => {
            player.setWaitingFor(new SelectSpace(this.name, "Select space on mars for city tile", (space: ISpace) => {
                try { game.addCityTile(player, space.id); }
                catch (err) { reject(err); return; }
                resolve();
            }));
        }); 
    }
}
