
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
    public play(player: Player, game: Game): Promise<void> {
        if (player.energyProduction < 1) {
            return Promise.reject("Must have energy production");
        }
        return new Promise((resolve, reject) => {
            player.setWaitingFor(new SelectSpace(this, "Select space next to at least 2 other city tiles", (foundSpace: ISpace) => {
                const adjacentSpaces = game.getAdjacentSpaces(foundSpace);
                if (adjacentSpaces.filter((space) => space.tile && space.tile.tileType === TileType.CITY).length < 2) {
                    reject("Must place next to two city tiles");
                    return;
                }
                try { game.addTile(player, foundSpace.spaceType, foundSpace, { tileType: TileType.SPECIAL }); }
                catch (err) { reject(err); return; }
                player.energyProduction--;
                player.megaCreditProduction += 2;
                resolve();
            }));
        });
    }
}
