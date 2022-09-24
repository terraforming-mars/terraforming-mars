import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardResource} from '../../../common/CardResource';
import {TileType} from '../../../common/TileType';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {CardName} from '../../../common/cards/CardName';
import {AdjacencyBonus} from '../../ares/AdjacencyBonus';
import {ICardMetadata} from '../../../common/cards/ICardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Phase} from '../../../common/Phase';
import {played} from '../Options';
import {Board} from '../../boards/Board';

export class EcologicalZone extends Card implements IProjectCard {
  constructor(
    name = CardName.ECOLOGICAL_ZONE,
    cost = 12,
    adjacencyBonus: AdjacencyBonus | undefined = undefined,
    metadata: ICardMetadata = {
      description: {
        text: 'Requires that YOU have a greenery tile. Place this tile adjacent to ANY greenery.',
        align: 'left',
      },
      cardNumber: '128',
      renderData: CardRenderer.builder((b) => {
        b.effect('When you play an animal or plant tag INCLUDING THESE, add an animal to this card.', (eb) => {
          eb.animals(1, {played}).slash().plants(1, {played}).startEffect.animals(1);
        }).br;
        b.vpText('1 VP per 2 Animals on this card.').tile(TileType.ECOLOGICAL_ZONE, true).asterix();
      }),
    },
  ) {
    super({
      cardType: CardType.ACTIVE,
      name,
      tags: [Tag.ANIMAL, Tag.PLANT],
      cost,
      resourceType: CardResource.ANIMAL,
      adjacencyBonus,
      victoryPoints: VictoryPoints.resource(1, 2),

      requirements: CardRequirements.builder((b) => b.greeneries()),
      metadata,
    });
  }


  private getAvailableSpaces(player: Player): Array<ISpace> {
    return player.game.board.getAvailableSpacesOnLand(player)
      .filter((space) => player.game.board.getAdjacentSpaces(space).filter(Board.isGreenerySpace).length > 0);
  }
  public override bespokeCanPlay(player: Player): boolean {
    return this.getAvailableSpaces(player).length > 0;
  }
  public onCardPlayed(player: Player, card: IProjectCard): void {
    const qty = card.tags.filter((tag) => tag === Tag.ANIMAL || tag === Tag.PLANT).length;
    player.addResourceTo(this, {qty, log: true});
  }
  public override bespokePlay(player: Player) {
    // Get one extra animal from EcoExperts if played during prelude while having just played EcoExperts
    if (player.game.phase === Phase.PRELUDES && player.playedCards.length > 0 && player.playedCards[player.playedCards.length-1].name === CardName.ECOLOGY_EXPERTS) {
      player.addResourceTo(this, {qty: 1, log: true});
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
