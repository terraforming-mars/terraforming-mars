import {IActionCard} from '../ICard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardResource} from '../../../common/CardResource';
import {SelectCard} from '../../inputs/SelectCard';
import {CardName} from '../../../common/cards/CardName';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';

export class FloatingHabs extends Card implements IActionCard {
  constructor() {
    super({
      name: CardName.FLOATING_HABS,
      cardType: CardType.ACTIVE,
      tags: [Tag.VENUS],
      cost: 5,

      resourceType: CardResource.FLOATER,
      victoryPoints: VictoryPoints.resource(1, 2),

      requirements: CardRequirements.builder((b) => b.tag(Tag.SCIENCE, 2)),
      metadata: {
        cardNumber: '225',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 2 M€ to add 1 Floater to ANY card', (eb) => {
            eb.megacredits(2).startAction.floaters(1).asterix();
          }).br;
          b.vpText('1 VP for every 2nd Floater on this card.');
        }),
        description: 'Requires 2 science tags.',
      },
    });
  }
  public canAct(player: Player): boolean {
    return player.canAfford(2);
  }

  public action(player: Player) {
    const floaterCards = player.getResourceCards(CardResource.FLOATER);

    // add to itself if no other available target
    if (floaterCards.length === 1) {
      player.game.defer(new SelectPaymentDeferred(player, 2, {title: 'Select how to pay for Floating Habs action'}));
      player.addResourceTo(floaterCards[0], {log: true});
      return undefined;
    }

    return new SelectCard(
      'Spend 2 M€ and select card to add 1 floater',
      'Add floater',
      floaterCards,
      ([card]) => {
        player.game.defer(new SelectPaymentDeferred(player, 2, {title: 'Select how to pay for Floating Habs action'}));
        player.addResourceTo(card, {log: true});
        return undefined;
      },
    );
  }
}
