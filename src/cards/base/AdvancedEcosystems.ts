import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {CardName} from '../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';

export class AdvancedEcosystems extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.ADVANCED_ECOSYSTEMS,
      tags: [Tags.PLANT, Tags.MICROBE, Tags.ANIMAL],
      cost: 11,
      victoryPoints: 3,

      requirements: CardRequirements.builder((b) => b.tag(Tags.PLANT).tag(Tags.ANIMAL).tag(Tags.MICROBE)),
      metadata: {
        description: 'Requires a Plant tag, a Microbe tag, and an Animal tag.',
        cardNumber: '135',
      },
    });
  }
  public play() {
    return undefined;
  }
}
