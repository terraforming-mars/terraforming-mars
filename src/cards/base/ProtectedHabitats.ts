import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../render/Size';

export class ProtectedHabitats extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.PROTECTED_HABITATS,
      cost: 5,

      metadata: {
        cardNumber: '173',
        renderData: CardRenderer.builder((b) => {
          b.text('Opponents may not remove your', Size.SMALL, true).br;
          b.plants(1).animals(1).microbes(1);
        }),
      },
    });
  }

  public play(_player: Player) {
    return undefined;
  }
}
