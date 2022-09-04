import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {CardRenderer} from '../render/CardRenderer';

export class Tardigrades extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.TARDIGRADES,
      tags: [Tag.MICROBE],
      cost: 4,

      resourceType: CardResource.MICROBE,
      victoryPoints: VictoryPoints.resource(1, 4),

      metadata: {
        cardNumber: '049',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 Microbe to this card.', (eb) => {
            eb.empty().startAction.microbes(1);
          }).br;
          b.vpText('1 VP per 4 Microbes on this card.');
        }),
      },
    });
  }

  public action(player: Player) {
    player.addResourceTo(this);
    return undefined;
  }
  public canAct(): boolean {
    return true;
  }
}
