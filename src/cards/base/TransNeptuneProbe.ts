import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {CardName} from '../../common/cards/CardName';

export class TransNeptuneProbe extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.TRANS_NEPTUNE_PROBE,
      tags: [Tags.SCIENCE, Tags.SPACE],
      cost: 6,
      victoryPoints: 1,

      metadata: {
        cardNumber: '084',
      },
    });
  }
  public play() {
    return undefined;
  }
}
