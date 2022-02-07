import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {CardName} from '../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {max} from '../Options';

export class DustSeals extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.DUST_SEALS,
      cost: 2,
      victoryPoints: 1,

      requirements: CardRequirements.builder((b) => b.oceans(3, {max})),
      metadata: {
        description: 'Requires 3 or less ocean tiles.',
        cardNumber: '119',
      },
    });
  }
  public play() {
    return undefined;
  }
}
