import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class DevelopmentCenter extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.DEVELOPMENT_CENTER,
      tags: [Tag.SCIENCE, Tag.BUILDING],
      cost: 11,

      metadata: {
        cardNumber: '014',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 energy to draw a card.', (eb) => {
            eb.energy(1).startAction.cards(1);
          });
        }),
      },
    });
  }
  public canAct(player: Player): boolean {
    return player.energy > 0;
  }
  public action(player: Player) {
    player.energy--;
    player.drawCard();
    return undefined;
  }
}
