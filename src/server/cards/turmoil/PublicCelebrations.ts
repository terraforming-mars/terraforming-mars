import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';

export class PublicCelebrations extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 8,
      tags: [],
      name: CardName.PUBLIC_CELEBRATIONS,
      cardType: CardType.EVENT,

      requirements: CardRequirements.builder((b) => b.chairman()),
      victoryPoints: 2,

      metadata: {
        description: 'Requires that you are Chairman.',
        cardNumber: 'T10',
      },
    });
  }
}
