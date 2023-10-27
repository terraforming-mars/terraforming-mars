import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';
import {played} from '../Options';

export class OldWorldMafia extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.OLD_WORLD_MAFIA,
      cost: 11,
      tags: [Tag.EARTH],

      behavior: {
        underworld: {corruption: {tag: Tag.EARTH, per: 2}},
      },

      metadata: {
        cardNumber: 'U07',
        renderData: CardRenderer.builder((b) => {
          b.corruption(1).slash().earth(2, {played});
        }),
        description: 'Gain 1 corruption for every 2 earth tags you have, including this.',
      },
    });
  }
}
