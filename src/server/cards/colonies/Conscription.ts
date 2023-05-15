import {IProjectCard} from '../IProjectCard';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../requirements/CardRequirements';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';

export class Conscription extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      cost: 5,
      tags: [Tag.EARTH],
      name: CardName.CONSCRIPTION,
      victoryPoints: -1,

      requirements: CardRequirements.builder((b) => b.tag(Tag.EARTH, 2)),
      metadata: {
        cardNumber: 'C05',
        renderData: CardRenderer.builder((b) => {
          b.text('next card', Size.SMALL, true).colon().megacredits(-16);
        }),
        description: 'Requires 2 Earth tags. The next card you play this generation costs 16 M€ less.',
      },
    });
  }

  public override getCardDiscount(player: Player) {
    if (player.lastCardPlayed === this.name) {
      return 16;
    }
    return 0;
  }
}
