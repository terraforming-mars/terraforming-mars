import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {TileType} from '../../TileType';
import {ResourceType} from '../../ResourceType';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {CardName} from '../../CardName';
import {IResourceCard} from '../ICard';
import {IAdjacencyBonus} from '../../ares/IAdjacencyBonus';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {Phase} from '../../Phase';

export class EcologicalZone extends Card implements IProjectCard, IResourceCard {
  constructor(
    name: CardName = CardName.ECOLOGICAL_ZONE,
    cost: number = 12,
    adjacencyBonus: IAdjacencyBonus | undefined = undefined,
    metadata: CardMetadata = {
      description: {
        text: 'Requires that YOU have a greenery tile. Place this tile adjacent to ANY greenery.',
        align: 'left',
      },
      cardNumber: '128',
      renderData: CardRenderer.builder((b) => {
        b.effect('When you play an animal or plant tag /including these/, add an animal to this card.', (eb) => {
          eb.animals(1).played.slash().plants(1).played.startEffect.animals(1);
        }).br;
        b.vpText('1 VP per 2 Animals on this card.').tile(TileType.ECOLOGICAL_ZONE, true).asterix();
      }),
      victoryPoints: CardRenderDynamicVictoryPoints.animals(1, 2),
    },
  ) {
    super({
      cardType: CardType.ACTIVE,
      name,
      tags: [Tags.ANIMAL, Tags.PLANT],
      cost,
      resourceType: ResourceType.ANIMAL,
      adjacencyBonus,

      requirements: CardRequirements.builder((b) => b.greeneries()),
      metadata,
    });
  }

  public resourceCount: number = 0;

  private getAvailableSpaces(player: Player): Array<ISpace> {
    return player.game.board.getAvailableSpacesOnLand(player)
      .filter(
        (space) => player.game.board.getAdjacentSpaces(space).filter(
          (adjacentSpace) => adjacentSpace.tile !== undefined &&
              adjacentSpace.tile.tileType === TileType.GREENERY,
        ).length > 0,
      );
  }
  public canPlay(player: Player): boolean {
    return super.canPlay(player) && this.getAvailableSpaces(player).length > 0;
  }
  public onCardPlayed(player: Player, card: IProjectCard): void {
    player.addResourceTo(this, card.tags.filter((tag) => tag === Tags.ANIMAL || tag === Tags.PLANT).length);
  }
  public getVictoryPoints(): number {
    return Math.floor(this.resourceCount / 2);
  }
  public play(player: Player) {
    // Get one extra animal from EcoExperts if played during prelude while having just played EcoExperts
    if (player.game.phase === Phase.PRELUDES && player.playedCards.length > 0 && player.playedCards[player.playedCards.length-1].name === CardName.ECOLOGY_EXPERTS) {
      player.addResourceTo(this, 1);
    }

    return new SelectSpace(
      'Select space next to greenery for special tile',
      this.getAvailableSpaces(player),
      (requestedSpace: ISpace) => {
        player.game.addTile(player, requestedSpace.spaceType, requestedSpace, {
          tileType: TileType.ECOLOGICAL_ZONE,
        });
        requestedSpace.adjacency = this.adjacencyBonus;
        return undefined;
      },
    );
  }
}
