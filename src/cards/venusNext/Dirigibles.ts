import {ICard, IActionCard, IResourceCard} from '../ICard';
import {Tags} from '../../common/cards/Tags';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardResource} from '../../common/CardResource';
import {SelectCard} from '../../inputs/SelectCard';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {played} from '../Options';

export class Dirigibles extends Card implements IActionCard, IResourceCard {
  constructor() {
    super({
      name: CardName.DIRIGIBLES,
      cardType: CardType.ACTIVE,
      tags: [Tags.VENUS],
      cost: 11,
      resourceType: CardResource.FLOATER,

      metadata: {
        cardNumber: '222',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 Floater to ANY card', (eb) => {
            eb.empty().startAction.floaters(1).asterix();
          }).br;
          b.effect('When playing a Venus tag, Floaters here may be used as payment, and are worth 3M€ each.', (eb) => {
            eb.venus(1, {played}).startEffect.floaters(1).equals().megacredits(3);
          });
        }),
      },
    });
  }

  public override resourceCount: number = 0;

  public play() {
    return undefined;
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
      (foundCards: Array<ICard>) => {
        player.addResourceTo(foundCards[0], {log: true});
        return undefined;
      },
    );
  }
}
