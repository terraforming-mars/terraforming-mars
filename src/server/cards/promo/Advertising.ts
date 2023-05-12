import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {Resource} from '../../../common/Resource';
import {CardRenderer} from '../render/CardRenderer';

export class Advertising extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.ADVERTISING,
      tags: [Tag.EARTH],
      cost: 4,

      metadata: {
        cardNumber: 'X13',
        renderData: CardRenderer.builder((b) => b.effect('When you play a card with a basic cost of 20 M€ or more, increase your M€ production 1 step.', (be) => {
          be.megacredits(20).asterix().startEffect.production((pb) => pb.megacredits(1));
        })),
      },
    });
  }

  public onCardPlayed(player: Player, card: IProjectCard) {
    if (card.cost >= 20) {
      player.production.add(Resource.MEGACREDITS, 1);
    }
  }
}
