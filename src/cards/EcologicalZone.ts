
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {SpaceType} from '../SpaceType';
import {TileType} from '../TileType';
import {ResourceType} from '../ResourceType';
import {SelectSpace} from '../inputs/SelectSpace';
import {ISpace} from '../ISpace';

export class EcologicalZone implements IProjectCard {
  public cost: number = 12;
  public nonNegativeVPIcon: boolean = true;
  public resourceType: ResourceType = ResourceType.ANIMAL;
  public tags: Array<Tags> = [Tags.ANIMAL, Tags.PLANT];
  public cardType: CardType = CardType.ACTIVE;
  public name: string = 'Ecological Zone';
  private getAvailableSpaces(player: Player, game: Game): Array<ISpace> {
    return game.getAvailableSpacesOnLand(player)
        .filter(
            (space) => game.getAdjacentSpaces(space).filter(
                (adjacentSpace) => adjacentSpace.tile !== undefined &&
              adjacentSpace.tile.tileType === TileType.GREENERY
            ).length > 0
        );
  }
  private hasGreeneryTile(player: Player, game: Game): boolean {
    return game.getSpaces(SpaceType.OCEAN)
        .concat(game.getSpaces(SpaceType.LAND))
        .filter(
            (space) => space.tile !== undefined &&
          space.tile.tileType === TileType.GREENERY &&
          space.player === player
        ).length > 0;
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
  public getVictoryPoints(player: Player) {
    return Math.floor(player.getResourcesOnCard(this) / 2);
  }
  public play(player: Player, game: Game) {
    return new SelectSpace(
        'Select space next to greenery for special tile',
        this.getAvailableSpaces(player, game),
        (requestedSpace: ISpace) => {
          game.addTile(player, requestedSpace.spaceType, requestedSpace, {
            tileType: TileType.SPECIAL
          });
          return undefined;
        }
    );
  }
}
