import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {SpaceType} from '../../SpaceType';
import {TileType} from '../../TileType';
import {ResourceType} from '../../ResourceType';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../ISpace';
import {CardName} from '../../CardName';
import {IResourceCard} from '../ICard';
import {IAdjacencyBonus} from '../../ares/IAdjacencyBonus';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderItemSize} from '../render/CardRenderItemSize';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';

export class EcologicalZone implements IProjectCard, IResourceCard {
  public cost = 12;
  public resourceType = ResourceType.ANIMAL;
  public resourceCount: number = 0;
  public tags = [Tags.ANIMAL, Tags.PLANT];
  public cardType = CardType.ACTIVE;
  public name = CardName.ECOLOGICAL_ZONE;
  public adjacencyBonus?: IAdjacencyBonus = undefined;

  private getAvailableSpaces(player: Player, game: Game): Array<ISpace> {
    return game.board.getAvailableSpacesOnLand(player)
      .filter(
        (space) => game.board.getAdjacentSpaces(space).filter(
          (adjacentSpace) => adjacentSpace.tile !== undefined &&
              adjacentSpace.tile.tileType === TileType.GREENERY,
        ).length > 0,
      );
  }
  private hasGreeneryTile(player: Player, game: Game): boolean {
    return game.board.getSpaces(SpaceType.OCEAN, player)
      .concat(game.board.getSpaces(SpaceType.LAND, player))
      .filter(
        (space) => space.tile !== undefined &&
          space.tile.tileType === TileType.GREENERY &&
          space.player === player,
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
          tileType: TileType.ECOLOGICAL_ZONE,
        });
        requestedSpace.adjacency = this.adjacencyBonus;
        return undefined;
      },
    );
  }
  public metadata: CardMetadata = {
    description: {
      text: 'Requires that YOU have a greenery tile. Place this tile adjacent to ANY greenery.',
      align: 'left',
    },
    cardNumber: '128',
    requirements: CardRequirements.builder((b) => b.forests()),
    renderData: CardRenderer.builder((b) => {
      b.effectBox((eb) => {
        eb.animals(1).played.slash().plants(1).played.startEffect.animals(1);
        eb.description('Effect: When you play an animal or plant tag /including these/, add an animal to this card.');
      }).br;
      b.text('1 VP per 2 Animals on this card.', CardRenderItemSize.TINY, true).tile(TileType.ECOLOGICAL_ZONE, true).asterix();
    }),
    victoryPoints: CardRenderDynamicVictoryPoints.animals(1, 2),
  };
}
