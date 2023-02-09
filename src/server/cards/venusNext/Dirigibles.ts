import {IActionCard} from '../ICard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardResource} from '../../../common/CardResource';
import {SelectCard} from '../../inputs/SelectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {played} from '../Options';

export class Dirigibles extends Card implements IActionCard {
  constructor() {
    super({
      name: CardName.DIRIGIBLES,
      cardType: CardType.ACTIVE,
      tags: [Tag.VENUS],
      cost: 11,
      resourceType: CardResource.FLOATER,

      metadata: {
        cardNumber: '222',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 floater to ANY card', (eb) => {
            eb.empty().startAction.floaters(1).asterix();
          }).br;
          b.effect('When playing a Venus tag, Floaters here may be used as payment, and are worth 3M€ each.', (eb) => {
            eb.venus(1, {played}).startEffect.floaters(1).equals().megacredits(3);
          });
        }),
      },
    });
  }

  public canAct(): boolean {
    return true;
  }
  public action(player: Player) {
    const floaterCards = player.getResourceCards(CardResource.FLOATER);
    if (floaterCards.length === 1) {
      player.addResourceTo(this, {log: true});
      return undefined;
    }

    return new SelectCard(
      'Select card to add 1 floater',
      'Add floater',
      floaterCards,
      ([card]) => {
        player.addResourceTo(card, {log: true});
        return undefined;
      },
    );
  }
}
