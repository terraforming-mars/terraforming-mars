import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resource} from '../../../common/Resource';
import {Tag} from '../../../common/cards/Tag';
import {all} from '../Options';

export class DustStorm extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.DUST_STORM,
      cost: 17,
      tags: [Tag.MARS],

      behavior: {
        global: {temperature: 2},
      },

      metadata: {
        cardNumber: 'Pf08',
        renderData: CardRenderer.builder((b) => {
          b.minus().energy(1, {all}).asterix();
          b.br;
          b.temperature(2);
        }),
        description: 'Every player loses all energy. Raise the temperature 2 steps.',
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    player.game.getPlayers().forEach((target) => {
      target.maybeBlockAttack(player, (proceed) => {
        if (proceed) {
          target.stock.deduct(Resource.ENERGY, target.energy, {log: true});
        }
        return undefined;
      });
    });
    return undefined;
  }
}

