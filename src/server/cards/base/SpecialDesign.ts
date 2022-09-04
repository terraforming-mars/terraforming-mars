import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class SpecialDesign extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.SPECIAL_DESIGN,
      tags: [Tag.SCIENCE],
      cost: 4,

      metadata: {
        cardNumber: '206',
        renderData: CardRenderer.builder((b) => {
          b.plate('Global requirements').colon().text('+/- 2');
        }),
        description: 'The next card you play this generation is +2 or -2 steps in global requirements, your choice.',
      },
    });
  }
  public getRequirementBonus(player: Player): number {
    if (player.lastCardPlayed === this.name) {
      return 2;
    }
    return 0;
  }
}
