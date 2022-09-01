import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card2} from '../Card';

export class RimFreighters extends Card2 implements IProjectCard {
  constructor() {
    super({
      cost: 4,
      tags: [Tag.SPACE],
      name: CardName.RIM_FREIGHTERS,
      cardType: CardType.ACTIVE,

      metadata: {
        cardNumber: 'C35',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you trade, you pay 1 less resource for it.', (eb) => {
            eb.trade().startEffect.tradeDiscount(1);
          });
        }),
      },
    });
  }

  public override bespokePlay(player: Player) {
    player.colonies.tradeDiscount++;
    return undefined;
  }

  public onDiscard(player: Player): void {
    player.colonies.tradeDiscount--;
  }
}
