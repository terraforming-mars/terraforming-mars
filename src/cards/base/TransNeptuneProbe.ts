import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';

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
