import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {Board} from '../../boards/Board';
import {Size} from '../../../common/cards/render/Size';

export class GreeneryEmbellishment extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.GREENERY_EMBELLISHMENT,
      tags: [Tag.PLANT],
      cost: 18,
      victoryPoints: 2,
      requirements: {tag: Tag.PLANT, count: 5},
      metadata: {
        cardNumber: 'B13',
        description: 'Requires you own at least 5 Plant tags. Increase your M€ production 2 steps for each City you own adjacent to at least one Greenery.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(2)).slash().city({size: Size.SMALL}).asterix();
        }),
      },
    });
  }

  public override play(player: IPlayer) {
    const board = player.game.board;
    let count = 0;
    for (const space of board.spaces) {
      if (space.player === player && Board.isCitySpace(space)) {
        if (board.getAdjacentSpaces(space).some((adj) => Board.isGreenerySpace(adj))) {
          count++;
        }
      }
    }
    if (count > 0) player.production.add(Resource.MEGACREDITS, count * 2, {log: true});
    return undefined;
  }
}
