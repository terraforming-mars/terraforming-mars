import {IActionCard} from '../ICard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';

export class VenusianInsects extends Card implements IActionCard {
  constructor() {
    super({
      name: CardName.VENUSIAN_INSECTS,
      cardType: CardType.ACTIVE,
      tags: [Tag.VENUS, Tag.MICROBE],
      cost: 5,
      resourceType: CardResource.MICROBE,
      victoryPoints: VictoryPoints.resource(1, 2),

      requirements: CardRequirements.builder((b) => b.venus(12)),
      metadata: {
        cardNumber: '260',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 Microbe to this card.', (eb)=> {
            eb.empty().startAction.microbes(1);
          }).br;
          b.vpText('1 VP for every 2nd Microbe on this card.');
        }),
        description: 'Requires Venus 12%.',
      },
    });
  }
  public canAct(): boolean {
    return true;
  }
  public action(player: Player) {
    player.addResourceTo(this);
    return undefined;
  }
}
