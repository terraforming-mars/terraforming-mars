import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class ToolWithTheFirstOrder extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.TOOL_WITH_THE_FIRST_ORDER,
      tags: [Tag.SPACE],
      cost: 5,

      behavior: {
        tr: 1,
      },

      metadata: {
        cardNumber: 'SW08',
        renderData: CardRenderer.builder((b) => {
          b.arrow().br.tr(1);
        }),
        description: 'Take another action this turn. Gain 1 TR.',
      },
    });
  }

  public override bespokePlay(player: Player) {
    player.availableActionsThisRound++;
    return undefined;
  }
}
