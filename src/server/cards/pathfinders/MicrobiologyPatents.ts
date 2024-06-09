import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {Resource} from '../../../common/Resource';

export class MicrobiologyPatents extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.MICROBIOLOGY_PATENTS,
      cost: 6,
      tags: [Tag.MARS, Tag.MICROBE],

      metadata: {
        cardNumber: 'Pf63',
        renderData: CardRenderer.builder((b) => {
          b.effect('After you play a card with a microbe tag, increase your M€ production 1 step.',
            (eb) => eb.tag(Tag.MICROBE).startEffect.production((pb) => pb.megacredits(1)));
        }),
      },
    });
  }

  public onCardPlayed(player: IPlayer, card: IProjectCard) {
    if (card.tags.includes(Tag.MICROBE)) {
      player.production.add(Resource.MEGACREDITS, 1, {log: true});
    }
  }
}
