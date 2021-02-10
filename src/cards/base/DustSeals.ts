import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';

export class DustSeals extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.DUST_SEALS,
      cost: 2,

      requirements: CardRequirements.builder((b) => b.oceans(3).max()),
      metadata: {
        description: 'Requires 3 or less ocean tiles.',
        cardNumber: '119',
        victoryPoints: 1,
      },
    });
  }
  public play() {
    return undefined;
  }
  public getVictoryPoints() {
    return 1;
  }
}
