import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resource} from '../../../common/Resource';

export class OptimalAerobraking extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.OPTIMAL_AEROBRAKING,
      tags: [Tag.SPACE],
      cost: 7,

      metadata: {
        cardNumber: '031',
        renderData: CardRenderer.builder((b) => b.effect('When you play a space event, you gain 3 M€ and 3 heat.', (be) => {
          be.tag(Tag.SPACE).tag(Tag.EVENT).startEffect.megacredits(3).heat(3);
        })),
      },
    });
  }

  public onCardPlayed(player: IPlayer, card: IProjectCard) {
    if (card.type === CardType.EVENT && card.tags.includes(Tag.SPACE)) {
      player.stock.add(Resource.MEGACREDITS, 3, {log: true, from: this});
      player.stock.add(Resource.HEAT, 3, {log: true, from: this});
    }
  }
}
