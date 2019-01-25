
import { IActiveProjectCard } from "./IActiveProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { TileType } from "../TileType";

export class IndustrialCenter implements IActiveProjectCard {
    public cost: number = 4;
    public tags: Array<Tags> = [Tags.STEEL];
    public cardType: CardType = CardType.ACTIVE;
    public name: string = "Industrial Center";
    public actionText: string = "Spend 7 mega credit to increase your steel production 1 step.";
    public text: string = "Place a tile adjacent to a city tile.";
    public description: string = "Assigned to heavy industry, this area is not the nicest place on Mars";
    public play(player: Player, game: Game): Promise<void> {
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
                const adjacentSpaces = game.getAdjacentSpaces(foundSpace);
                if (adjacentSpaces.filter((adjacentSpace) => adjacentSpace.tile && adjacentSpace.tile.tileType === TileType.CITY).length === 0) {
                    reject("Tile must be placed by a city tile");
                    return;
                }
                try { game.addTile(player, foundSpace.spaceType, foundSpace, { tileType: TileType.SPECIAL }); }
                catch (err) { reject(err); return; }
                resolve();
            });
        });
    }
    public action(player: Player, _game: Game): Promise<void> {
        if (player.megaCredits < 7) {
            return Promise.reject("Don't have 7 mega credit to spend");
        }
        player.megaCredits -= 7;
        player.steelProduction++;
        return Promise.resolve();
    }
}

