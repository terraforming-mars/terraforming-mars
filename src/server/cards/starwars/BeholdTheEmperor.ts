import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class BeholdTheEmperor extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.BEHOLD_THE_EMPEROR,
      tags: [Tag.EARTH],
      cost: 10,
      requirements: {chairman: 1},

      metadata: {
        cardNumber: 'SW03',
        renderData: CardRenderer.builder((b) => b.chairman().asterix()),
        description:
          'Requires that you are Chairman. The current ruling party will automatically be the ruling party during the next Solar phase, ' +
          'and you will remain the Chairman. (As if the current ruling party were dominant and you were its party leader.)',
      },
    });
  }

  public override bespokePlay(player: Player) {
    player.game.beholdTheEmperor = true;
    return undefined;
  }
}
