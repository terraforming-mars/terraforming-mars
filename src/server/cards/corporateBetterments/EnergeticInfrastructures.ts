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

export class EnergeticInfrastructures extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.ENERGETIC_INFRASTRUCTURES,
      tags: [Tag.POWER],
      cost: 12,
      metadata: {
        cardNumber: 'B47',
        description: 'Get 5 M€ for each Power tag you own (including this). Other players get 2 M€ for each Power tag they own.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(5).slash().tag(Tag.POWER, {size: Size.SMALL}).br;
          b.megacredits(2).slash().tag(Tag.POWER, {size: Size.SMALL, all});
        }),
      },
    });
  }

  public override play(player: IPlayer) {
    player.stock.add(Resource.MEGACREDITS, player.tags.count(Tag.POWER, 'raw') * 5, {log: true});
    for (const other of player.game.players) {
      if (other === player) continue;
      const count = other.tags.count(Tag.POWER, 'raw');
      if (count > 0) other.stock.add(Resource.MEGACREDITS, count * 2, {log: true});
    }
    return undefined;
  }
}
