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

export class AdvancedSchools extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.ADVANCED_SCHOOLS,
      tags: [Tag.SCIENCE],
      cost: 15,
      metadata: {
        cardNumber: 'B39',
        description: 'Get 3 M€ for each Science tag you own (including this). Other players get 1 M€ for each Science tag they own.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(3).slash().tag(Tag.SCIENCE, {size: Size.SMALL}).br;
          b.megacredits(1).slash().tag(Tag.SCIENCE, {size: Size.SMALL, all});
        }),
      },
    });
  }

  public override play(player: IPlayer) {
    player.stock.add(Resource.MEGACREDITS, player.tags.count(Tag.SCIENCE, 'raw') * 3, {log: true});
    for (const other of player.game.players) {
      if (other === player) continue;
      const count = other.tags.count(Tag.SCIENCE, 'raw');
      if (count > 0) other.stock.add(Resource.MEGACREDITS, count, {log: true});
    }
    return undefined;
  }
}
