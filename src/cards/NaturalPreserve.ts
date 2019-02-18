
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { TileType } from "../TileType";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { ISpace } from "../ISpace";
import { SelectSpace } from "../inputs/SelectSpace";

export class NaturalPreserve implements IProjectCard {
    public cost: number = 9;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.STEEL];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Natural Preserve";
    public text: string = "Oxygen must be 4% or less. Place a special tile next to no other tile. Increase your mega credit production 1 step. Gain 1 victory point";
    public description: string = "Creating a national park with original Martian landforms and environments.";
    private getAvailableSpaces(player: Player, game: Game): Array<ISpace> {
        return game.getAvailableSpacesOnLand(player)
                .filter((space) => game.getAdjacentSpaces(space).filter((adjacentSpace) => adjacentSpace.tile === undefined).length === 0);
    }
    public play(player: Player, game: Game): Promise<void> {
        if (game.getOxygenLevel() > 4) {
            return Promise.reject("Oxygen must be 4% or less.");
        }
        return new Promise((resolve, reject) => {
            player.setWaitingFor(new SelectSpace(this.name, "Select space for special tile next to no other tile", this.getAvailableSpaces(player, game), (foundSpace: ISpace) => {
                try { game.addTile(player, foundSpace.spaceType, foundSpace, { tileType: TileType.SPECIAL }); }
                catch (err) { reject(err); return; }
                player.megaCreditProduction++;
                player.victoryPoints++;
                resolve();
            }));
        });
    }
}
