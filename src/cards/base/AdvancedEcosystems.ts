import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';

export class AdvancedEcosystems extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.ADVANCED_ECOSYSTEMS,
      tags: [Tags.PLANT, Tags.MICROBE, Tags.ANIMAL],
      cost: 11,

      requirements: CardRequirements.builder((b) => b.tag(Tags.PLANT).tag(Tags.ANIMAL).tag(Tags.MICROBE)),
      metadata: {
        description: 'Requires a Plant tag, a Microbe tag, and an Animal tag.',
        cardNumber: '135',
        victoryPoints: 3,
      },
    });
  }
  public play() {
    return undefined;
  }
  public getVictoryPoints() {
    return 3;
  }
}
