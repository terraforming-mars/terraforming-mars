import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../Tags';
import {Size} from '../render/Size';

export class PrivateSecurity extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.PRIVATE_SECURITY,
      cost: 8,
      tags: [Tags.EARTH],

      metadata: {
        cardNumber: 'Pf25',
        renderData: CardRenderer.builder((b) => {
          b.text('Opponents may not remove your', Size.SMALL, true).br;
          b.megacredits(1).production((pb) => pb.megacredits(1)).br;
        }),
      },
    });
  }

  public play() {
    return undefined;
  }
}

