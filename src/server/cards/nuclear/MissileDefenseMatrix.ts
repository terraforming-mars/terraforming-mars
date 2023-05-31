import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {played} from '../Options';

export class MissileDefenseMatrix extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.MISSILE_DEFENSE_MATRIX,
      type: CardType.AUTOMATED,
      tags: [Tag.RADIATION, Tag.EARTH],
      cost: 25,
      victoryPoints: {tag: Tag.RADIATION, per: 2},

      behavior: {
        global: {oxygen: 1},
        drawCard: {count: {tag: Tag.RADIATION, per: 2}},
      },

      metadata: {
        description: 'Draw 1 card per 2 radiation tags you have, including this. Score 1VP for every 2 radiations tag you have.',
        cardNumber: 'N71',
        renderData: CardRenderer.builder((b) => {
          b.cards(1).slash().radiation({amount: 2, played}).radiation();
        }),
      },
    });
  }
}
