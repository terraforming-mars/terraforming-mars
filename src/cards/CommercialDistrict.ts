
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
    public play(player: Player, game: Game): Promise<void> {
        if (player.energyProduction < 1) {
            return Promise.reject("Must have energy production");
        }
        return new Promise((resolve, reject) => {
            player.setWaitingFor(new SelectSpace(this.name, "Select space for special tile", (foundSpace: ISpace) => {
                try { game.addTile(player, foundSpace.spaceType, foundSpace, { tileType: TileType.SPECIAL }); }
                catch (err) { reject(err); return; }
                player.energyProduction--;
                player.megaCreditProduction += 4;
                game.addGameEndListener(() => {
                    const adjacentSpaces = game.getAdjacentSpaces(foundSpace);
                    adjacentSpaces.forEach((adjacentSpace) => {
                        if (adjacentSpace.tile && adjacentSpace.tile.tileType === TileType.CITY) {
                            player.victoryPoints++;
                        }
                    });
                });
                resolve();
            }));
        });
    }
}

