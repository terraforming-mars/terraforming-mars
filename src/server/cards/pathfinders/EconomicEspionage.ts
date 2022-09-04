import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {CardResource} from '../../../common/CardResource';
import {Player} from '../../Player';
import {IActionCard, VictoryPoints} from '../ICard';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';

export class EconomicEspionage extends Card implements IProjectCard, IActionCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.ECONOMIC_ESPIONAGE,
      cost: 8,
      tags: [Tag.EARTH],
      resourceType: CardResource.DATA,
      victoryPoints: VictoryPoints.resource(1, 3),

      metadata: {
        cardNumber: 'Pf37',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 2 M€ to Add 1 data to ANY card.', (eb) => {
            eb.megacredits(2).startAction.data({amount: 1}).asterix();
          }).br;
        }),
        description: '1VP for every 3 data here.',
      },
    });
  }


  public canAct(player: Player) {
    return player.canAfford(2);
  }

  public action(player: Player) {
    player.game.defer(new SelectPaymentDeferred(player, 2, {
      title: 'Select how to pay for action',
      afterPay: () => {
        player.game.defer(new AddResourcesToCard(player, CardResource.DATA));
      },
    }));
    return undefined;
  }
}
