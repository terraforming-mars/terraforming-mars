import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {Size} from '../../../common/cards/render/Size';
import {all} from '../Options';

export class MartianHotels extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.MARTIAN_HOTELS,
      tags: [Tag.MARS],
      cost: 8,
      metadata: {
        cardNumber: 'B18',
        description: 'Get 5 M€ for each pair of Building tags you own (including this). Each opponent gets 1 M€ for each Building tag they own.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(5).slash().tag(Tag.BUILDING, {size: Size.SMALL}).tag(Tag.BUILDING, {size: Size.SMALL}).br;
          b.megacredits(1).slash().tag(Tag.BUILDING, {size: Size.SMALL, all});
        }),
      },
    });
  }

  public override play(player: IPlayer) {
    const pairs = Math.floor(player.tags.count(Tag.BUILDING, 'raw') / 2);
    if (pairs > 0) player.stock.add(Resource.MEGACREDITS, pairs * 5, {log: true});
    for (const other of player.game.players) {
      if (other === player) continue;
      const tags = other.tags.count(Tag.BUILDING, 'raw');
      if (tags > 0) other.stock.add(Resource.MEGACREDITS, tags, {log: true});
    }
    return undefined;
  }
}
