import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {max} from '../Options';

export class ColonizerTrainingCamp extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.COLONIZER_TRAINING_CAMP,
      tags: [Tags.JOVIAN, Tags.BUILDING],
      cost: 8,
      victoryPoints: 2,

      requirements: CardRequirements.builder((b) => b.oxygen(5, {max})),
      metadata: {
        description: 'Oxygen must be 5% or less.',
        cardNumber: '001',
      },
    });
  }
  public play() {
    return undefined;
  }
}
