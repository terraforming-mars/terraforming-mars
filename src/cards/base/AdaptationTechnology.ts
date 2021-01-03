import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class AdaptationTechnology extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.ADAPTATION_TECHNOLOGY,
      tags: [Tags.SCIENCE],
      cost: 12,

      metadata: {
        cardNumber: '153',
        renderData: CardRenderer.builder((b) => {
          b.effectBox((eb) => {
            eb.plate('Global requirements').startEffect.text('+/- 2');
            eb.description('Effect: Your global requirements are +2 or -2 steps, your choice in each case.');
          });
        }),
        victoryPoints: 1,
      },
    });
  }
  public getRequirementBonus(): number {
    return 2;
  }
  public play() {
    return undefined;
  }
  public getVictoryPoints() {
    return 1;
  }
}
