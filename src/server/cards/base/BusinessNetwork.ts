import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';

export class BusinessNetwork extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.BUSINESS_NETWORK,
      tags: [Tag.EARTH],
      cost: 4,
      behavior: {
        production: {megacredits: -1},
      },

      metadata: {
        cardNumber: '110',
        description: 'Decrease your M€ production 1 step.',
        renderData: CardRenderer.builder((b) => {
          b.action(undefined, (eb) => eb.empty().startAction.empty()).text('Action: Look at the top card and either buy it or discard it', Size.SMALL, true).br;
          b.production((pb) => pb.megacredits(-1));
        }),
      },
    });
  }

  public canAct(): boolean {
    return true;
  }

  public action(player: Player) {
    return player.drawCardKeepSome(1, {paying: true});
  }
}
