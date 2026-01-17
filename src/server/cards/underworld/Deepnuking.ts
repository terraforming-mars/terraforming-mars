import {CardType} from '@/common/cards/CardType';
import {IProjectCard} from '@/server/cards/IProjectCard';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {Card} from '@/server/cards/Card';
import {all} from '@/server/cards/Options';

export class Deepnuking extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.DEEPNUKING,
      cost: 6,
      victoryPoints: -1,

      behavior: {
        underworld: {excavate: 2},
        removeAnyPlants: 3,
      },

      metadata: {
        cardNumber: 'U006',
        renderData: CardRenderer.builder((b) => {
          b.excavate(2).minus().plants(3, {all});
        }),
        description: 'Excavate 2 underground resources. Remove up to 3 plants from any player.',
      },
    });
  }
}
