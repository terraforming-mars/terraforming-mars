import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../../common/Resources';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IProjectCard} from '../IProjectCard';

export class OrbitalReflectors extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.ORBITAL_REFLECTORS,
      cardType: CardType.AUTOMATED,
      tags: [Tag.VENUS, Tag.SPACE],
      cost: 26,
      tr: {venus: 2},

      metadata: {
        cardNumber: '242',
        renderData: CardRenderer.builder((b) => {
          b.venus(2).br;
          b.production((pb) => {
            pb.heat(2);
          });
        }),
        description: 'Raise Venus 2 steps. Increase your heat production 2 steps.',
      },
    });
  }

  public play(player: Player) {
    player.game.increaseVenusScaleLevel(player, 2);
    player.production.add(Resources.HEAT, 2);
    return undefined;
  }
}
