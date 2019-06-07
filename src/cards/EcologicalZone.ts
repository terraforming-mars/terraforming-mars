
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
    private getAvailableSpaces(player: Player, game: Game): Array<ISpace> {
        return game.getAvailableSpacesOnLand(player)
                .filter((space) => game.getAdjacentSpaces(space).filter((adjacentSpace) => adjacentSpace.tile !== undefined && adjacentSpace.tile.tileType === TileType.GREENERY).length > 0);
    }
    private hasGreeneryTile(player: Player, game: Game): boolean {
        return game.getSpaces(SpaceType.OCEAN).concat(game.getSpaces(SpaceType.LAND)).filter((space) => space.tile !== undefined && space.tile.tileType === TileType.GREENERY && space.player === player).length > 0;
    }
    public canPlay(player: Player, game: Game): boolean {
        return this.hasGreeneryTile(player, game);
    }
    public onCardPlayed(_player: Player, _game: Game, card: IProjectCard): void {
        if (card.tags.indexOf(Tags.ANIMAL) !== -1 ||
            card.tags.indexOf(Tags.PLANT) !== -1) {
            this.animals++;
        } 
    }
    public play(player: Player, game: Game) {
        return new SelectSpace("Select space next to greenery for special tile", this.getAvailableSpaces(player, game), (requestedSpace: ISpace) => {
            game.addTile(player, requestedSpace.spaceType, requestedSpace, { tileType: TileType.SPECIAL });
            game.addGameEndListener(() => {
                player.victoryPoints += Math.floor(this.animals / 2);
            });
            return undefined;
        });
    }
}
