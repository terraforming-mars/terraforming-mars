import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CanAffordOptions, IPlayer} from '../../IPlayer';
import {CardResource} from '../../../common/CardResource';
import {TileType} from '../../../common/TileType';
import {SelectSpace} from '../../inputs/SelectSpace';
import {Space} from '../../boards/Space';
import {CardName} from '../../../common/cards/CardName';
import {AdjacencyBonus} from '../../ares/AdjacencyBonus';
import {CardMetadata} from '../../../common/cards/CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {Phase} from '../../../common/Phase';
import {Board} from '../../boards/Board';

export class EcologicalZone extends Card implements IProjectCard {
  constructor(
    name = CardName.ECOLOGICAL_ZONE,
    cost = 12,
    adjacencyBonus: AdjacencyBonus | undefined = undefined,
    metadata: CardMetadata = {
      description: {
        text: 'Requires that YOU have a greenery tile. Place this tile adjacent to ANY greenery.',
        align: 'left',
      },
      cardNumber: '128',
      renderData: CardRenderer.builder((b) => {
        b.effect('When you play an animal or plant tag INCLUDING THESE, add an animal to this card.', (eb) => {
          eb.tag(Tag.ANIMAL).slash().tag(Tag.PLANT).startEffect.resource(CardResource.ANIMAL);
        }).br;
        b.vpText('1 VP per 2 animals on this card.').tile(TileType.ECOLOGICAL_ZONE, true).asterix();
      }),
    },
  ) {
    super({
      type: CardType.ACTIVE,
      name,
      tags: [Tag.ANIMAL, Tag.PLANT],
      cost,
      resourceType: CardResource.ANIMAL,
      adjacencyBonus,
      victoryPoints: {resourcesHere: {}, per: 2},
      requirements: {greeneries: 1},
      metadata,
    });
  }


  private getAvailableSpaces(player: IPlayer, canAffordOptions?: CanAffordOptions): Array<Space> {
    return player.game.board.getAvailableSpacesOnLand(player, canAffordOptions)
      .filter((space) => player.game.board.getAdjacentSpaces(space).filter(Board.isGreenerySpace).length > 0);
  }
  public override bespokeCanPlay(player: IPlayer, canAffordOptions: CanAffordOptions): boolean {
    return this.getAvailableSpaces(player, canAffordOptions).length > 0;
  }
  public onCardPlayed(player: IPlayer, card: IProjectCard): void {
    const qty = player.tags.cardTagCount(card, [Tag.ANIMAL, Tag.PLANT]);
    player.addResourceTo(this, {qty, log: true});
  }
  public override bespokePlay(player: IPlayer) {
    // Get one extra animal from EcoExperts if played during prelude while having just played EcoExperts
    if (player.game.phase === Phase.PRELUDES && player.playedCards.length > 0 && player.playedCards[player.playedCards.length-1].name === CardName.ECOLOGY_EXPERTS) {
      player.addResourceTo(this, {qty: 1, log: true});
    }

    return new SelectSpace('Select space next to greenery for special tile', this.getAvailableSpaces(player))
      .andThen((space) => {
        player.game.addTile(player, space, {
          tileType: TileType.ECOLOGICAL_ZONE,
        });
        space.adjacency = this.adjacencyBonus;
        return undefined;
      });
  }
}
