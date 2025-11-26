import {IProjectCard} from '@/server/cards/IProjectCard';
import {Card} from '@/server/cards/Card';
import {CardType} from '@/common/cards/CardType';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';

export class ReleaseOfInertGases extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.RELEASE_OF_INERT_GASES,
      cost: 14,

      behavior: {
        tr: 2,
      },

      metadata: {
        cardNumber: '036',
        renderData: CardRenderer.builder((b) => {
          b.tr(2);
        }),
        description: 'Raise your terraforming rating 2 steps.',
      },
    });
  }
}
