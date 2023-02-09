import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {Resources} from '../../../common/Resources';
import {played} from '../Options';

export class MicrobiologyPatents extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.MICROBIOLOGY_PATENTS,
      cost: 6,
      tags: [Tag.MARS, Tag.MICROBE],

      metadata: {
        cardNumber: 'Pf63',
        renderData: CardRenderer.builder((b) => {
          b.effect('After you play a card with a microbe tag, increase your M€ production 1 step.',
            (eb) => eb.microbes(1, {played}).startEffect.production((pb) => pb.megacredits(1)));
        }),
      },
    });
  }

  public onCardPlayed(player: Player, card: IProjectCard) {
    if (card.tags.includes(Tag.MICROBE)) {
      player.production.add(Resources.MEGACREDITS, 1, {log: true});
    }
  }
}
