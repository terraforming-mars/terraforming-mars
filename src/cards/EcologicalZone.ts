
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SpaceType } from "../SpaceType";
import { TileType } from "../TileType";
import { ResourceType } from "../ResourceType";
import { SelectSpace } from "../inputs/SelectSpace";
import { ISpace } from "../ISpace";

export class EcologicalZone implements IProjectCard {
    public cost: number = 12;
    public nonNegativeVPIcon: boolean = true;
    public resourceType: ResourceType = ResourceType.ANIMAL;
    public tags: Array<Tags> = [Tags.ANIMAL, Tags.PLANT];
    public cardType: CardType = CardType.ACTIVE;
    public name: string = "Ecological Zone";
    public text: string = "Requires that you have a greenery tile. Place a special tile adjacent to any greenery tile. When you play an animal or a plant tag (including these 2), add an animal to this card. 1 victory point per 2 animals on this card.";
    public requirements: string = "Greenery";
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
    public onCardPlayed(player: Player, _game: Game, card: IProjectCard): void {
        if (card.tags.indexOf(Tags.ANIMAL) !== -1 ||
            card.tags.indexOf(Tags.PLANT) !== -1) {
            player.addResourceTo(this);
        } 
    }
    public onGameEnd(player: Player) {
        player.victoryPoints += Math.floor(player.getResourcesOnCard(this) / 2);
    }
    public play(player: Player, game: Game) {
        return new SelectSpace("Select space next to greenery for special tile", this.getAvailableSpaces(player, game), (requestedSpace: ISpace) => {
            game.addTile(player, requestedSpace.spaceType, requestedSpace, { tileType: TileType.SPECIAL });
            return undefined;
        });
    }
}
