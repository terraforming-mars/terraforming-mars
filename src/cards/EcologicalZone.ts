
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
import { CardName } from '../CardName';
import { IResourceCard } from './ICard';

export class EcologicalZone implements IProjectCard, IResourceCard {
  public cost: number = 12;
  public resourceType: ResourceType = ResourceType.ANIMAL;
  public resourceCount: number = 0;
  public tags: Array<Tags> = [Tags.ANIMAL, Tags.PLANT];
  public cardType: CardType = CardType.ACTIVE;
  public name: CardName = CardName.ECOLOGICAL_ZONE;
  private getAvailableSpaces(player: Player, game: Game): Array<ISpace> {
    return game.board.getAvailableSpacesOnLand(player)
        .filter(
            (space) => game.board.getAdjacentSpaces(space).filter(
                (adjacentSpace) => adjacentSpace.tile !== undefined &&
              adjacentSpace.tile.tileType === TileType.GREENERY
            ).length > 0
        );
  }
  private hasGreeneryTile(player: Player, game: Game): boolean {
    return game.board.getSpaces(SpaceType.OCEAN)
        .concat(game.board.getSpaces(SpaceType.LAND))
        .filter(
            (space) => space.tile !== undefined &&
          space.tile.tileType === TileType.GREENERY &&
          space.player === player
        ).length > 0;
  }
  public canPlay(player: Player, game: Game): boolean {
    const hasGreenery = this.hasGreeneryTile(player, game);
    const canPlaceTile = this.getAvailableSpaces(player, game).length > 0;
    
    return hasGreenery && canPlaceTile;
  }
  public onCardPlayed(player: Player, _game: Game, card: IProjectCard): void {
      player.addResourceTo(this, card.tags.filter((tag) => tag === Tags.ANIMAL || tag === Tags.PLANT).length);
  }
  public getVictoryPoints(): number {
    return Math.floor(this.resourceCount / 2);
  }
  public play(player: Player, game: Game) {
    return new SelectSpace(
        'Select space next to greenery for special tile',
        this.getAvailableSpaces(player, game),
        (requestedSpace: ISpace) => {
          game.addTile(player, requestedSpace.spaceType, requestedSpace, {
            tileType: TileType.ECOLOGICAL_ZONE
          });
          return undefined;
        }
    );
  }
}
