import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {max} from '../Options';

export class DustSeals extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.DUST_SEALS,
      cost: 2,
      victoryPoints: 1,

      requirements: {oceans: 3, max},
      metadata: {
        description: 'Requires 3 or less ocean tiles.',
        cardNumber: '119',
      },
    });
  }
}
