
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { TileType } from "../TileType";

export class Capital implements IProjectCard {
    public cost: number = 26;
    public tags: Array<Tags> = [Tags.CITY, Tags.STEEL];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Capital";
    public text: string = "Requires 4 ocean tiles. Place a special city tile. Decrease your energy production 2 steps and increase your mega credit production 5 steps. Gain 1 additional victory point for each ocean tile adjacent to this city tile.";
    public description: string = "With its ideal placement and all its facilities, this is the true capital of Mars.";
    public play(player: Player, game: Game): Promise<void> {
        if (game.getOceansOnBoard() < 4) {
            return Promise.reject("Requires 4 ocean tiles.");
        }
        if (player.energyProduction < 2) {
            return Promise.reject("Requires 2 energy production.");
        }
        return new Promise((resolve, reject) => {
            player.setWaitingFor({
                initiator: "card",
                card: this,
                type: "SelectASpace"
            }, (spaceName: string) => {
                try { game.addCityTile(player, spaceName); }
                catch (err) { reject(err); return; }
                const pickedSpace = game.getSpace(spaceName);
                player.energyProduction -= 2;
                player.megaCreditProduction += 5;
                game.addGameEndListener(() => {
                    game.getAdjacentSpaces(pickedSpace).forEach((space) => {
                        if (space.tile && space.tile.tileType === TileType.OCEAN) {
                            player.victoryPoints++;
                        }
                    });
                });
                resolve();
            });
        });
    }
}
