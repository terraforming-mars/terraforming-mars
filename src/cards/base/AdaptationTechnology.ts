import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class AdaptationTechnology implements IProjectCard {
  public cost = 12;
  public tags = [Tags.SCIENCE];
  public name = CardName.ADAPTATION_TECHNOLOGY;
  public cardType = CardType.ACTIVE;

  public getRequirementBonus(): number {
    return 2;
  }
  public play() {
    return undefined;
  }
  public getVictoryPoints() {
    return 1;
  }
  public metadata: CardMetadata = {
    cardNumber: '153',
    renderData: CardRenderer.builder((b) => {
      b.effectBox((eb) => {
        eb.plate('Global requirements').startEffect.text('+/- 2');
        eb.description('Effect: Your global requirements are +2 or -2 steps, your choice in each case.');
      });
    }),
    victoryPoints: 1,
  }
}
