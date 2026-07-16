import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {CardResource} from '../../../common/CardResource';

export class ProtectedHabitats extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.PROTECTED_HABITATS,
      cost: 5,

      metadata: {
        cardNumber: '173',
        renderData: CardRenderer.builder((b) => {
          b.text('Opponents may not remove your', Size.SMALL, true).br;
          b.plants(1).resource(CardResource.ANIMAL).resource(CardResource.MICROBE);
        }),
      },
    });
  }
}
