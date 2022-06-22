import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class MicroMills extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.MICRO_MILLS,
      cost: 3,

      metadata: {
        cardNumber: '164',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.heat(1));
        }),
        description: 'Increase your heat production 1 step.',
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.HEAT, 1);
    return undefined;
  }
}

