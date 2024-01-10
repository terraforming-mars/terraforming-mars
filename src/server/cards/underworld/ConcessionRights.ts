import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';

export class ConcessionRights extends Card implements IProjectCard {
  public generationUsed: number = -1;

  constructor() {
    super({
      name: CardName.CONCESSION_RIGHTS,
      type: CardType.AUTOMATED,
      cost: 8,
      tags: [Tag.MARS],
      requirements: {tag: Tag.EARTH},
      victoryPoints: -1,

      behavior: {
        underworld: {
          markThisGeneration: {},
          excavate: 1,
          corruption: 1,
        },
      },

      metadata: {
        cardNumber: 'U32',
        renderData: CardRenderer.builder((b) => {
          b.excavate().emptyTile().asterix().nbsp.excavate().corruption();
        }),
        description: 'Requires 1 Earth tag. Until the end of this generation, ' +
        'you can excavate ignoring placement restrictions. Excavate 1 underground resource. Gain 1 corruption.',
      },
    });
  }
}
