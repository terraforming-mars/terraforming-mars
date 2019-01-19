
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { TileType } from "../TileType";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SpaceType } from "../SpaceType";

export class NaturalPreserve implements IProjectCard {
    public cost: number = 9;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.STEEL];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Natural Preserve";
    public text: string = "Oxygen must be 4% or less. Place this tile next to not other tile. Increase your mega credit production 1 step. Gain 1 victory point";
    public description: string = "Creating a national park with original Martian landforms and environments.";
    public play(player: Player, game: Game): Promise<void> {
        if (game.getOxygenLevel() > 4) {
            return Promise.reject("Oxygen must be 4% or less.");
        }
        return new Promise((resolve, reject) => {
            player.setWaitingFor({
                initiator: "card",
                card: this,
                type: "SelectASpace"
            }, (spaceId: string) => {
                const foundSpace = game.getSpace(spaceId);
                if (foundSpace === undefined) {
                    reject("Space not found");
                    return;
                }
                if (foundSpace.spaceType === SpaceType.COLONY) {
                    reject("Must be placed on mars.");
                    return;
                }
                const adjacentSpaces = game.getAdjacentSpaces(foundSpace);
                if (adjacentSpaces.length > 0) {
                    reject("Tile must be placed next to no other tile.");
                    return;
                }
                try { game.addTile(player, foundSpace.spaceType, foundSpace, { tileType: TileType.SPECIAL }); }
                catch (err) { reject(err); return; }
                player.megaCreditProduction++;
                player.victoryPoints++;
                resolve();
            });
        });
    }
}
