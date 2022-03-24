import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class AdaptationTechnology extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.ADAPTATION_TECHNOLOGY,
      tags: [Tags.SCIENCE],
      cost: 12,
      victoryPoints: 1,

      metadata: {
        cardNumber: '153',
        renderData: CardRenderer.builder((b) => {
          b.effect('Your global requirements are +2 or -2 steps, your choice in each case.', (eb) => {
            eb.plate('Global requirements').startEffect.text('+/- 2');
          });
        }),
      },
    });
  }
  public getRequirementBonus(): number {
    return 2;
  }
  public play() {
    return undefined;
  }
}
