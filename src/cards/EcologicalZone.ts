
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SpaceType } from "../SpaceType";
import { TileType } from "../TileType";
import { SelectSpace } from "../inputs/SelectSpace";
import { ISpace } from "../ISpace";

export class EcologicalZone implements IProjectCard {
    public cost: number = 12;
    public animals: number = 0;
    public tags: Array<Tags> = [Tags.ANIMAL, Tags.PLANT];
    public cardType: CardType = CardType.ACTIVE;
    public name: string = "Ecological Zone";
    public text: string = "Requires that you have a greenery tile. Place a special tile adjacent to any greenery tile. When you play an animal or a plant tag (including these 2), add an animal to this card. 1 victory point per 2 animals on this card.";
    public description: string = "A secluded area where a multitude of species develop an ecosystem.";
    public play(player: Player, game: Game): Promise<void> {
        if (game.getSpaces(SpaceType.LAND).filter((space) => space.tile && space.tile.tileType === TileType.GREENERY && space.player && space.player === player).length === 0) {
            return Promise.reject("Requires that you have a greenery tile");
        }
        return new Promise((resolve, reject) => {
            player.setWaitingFor(new SelectSpace(this.name, "Select space next to greenery for special tile", (requestedSpace: ISpace) => {
                const adjacentTiles = game.getAdjacentSpaces(requestedSpace);
                if (adjacentTiles.filter((space) => space.tile && space.tile.tileType === TileType.GREENERY).length === 0) {
                    reject("Tile must be placed by greenery");
                    return;
                }
                try { game.addTile(player, requestedSpace.spaceType, requestedSpace, { tileType: TileType.SPECIAL }); }
                catch (err) { reject(err); return; }
                player.addCardPlayedHandler((card: IProjectCard) => {
                    if (card.tags.indexOf(Tags.ANIMAL) !== -1 ||
                        card.tags.indexOf(Tags.PLANT) !== -1) {
                        this.animals++;
                    }
                });
                game.addGameEndListener(() => {
                    player.victoryPoints += Math.floor(this.animals / 2);
                });
                resolve();
            }));
        });
    }
}
