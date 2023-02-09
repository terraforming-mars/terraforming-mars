import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {CardResource} from '../../../common/CardResource';
import {ICard} from '../ICard';
import {played} from '../Options';

export class MartianRepository extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.MARTIAN_REPOSITORY,
      cost: 12,
      tags: [Tag.MARS, Tag.MARS, Tag.BUILDING],
      resourceType: CardResource.DATA,

      behavior: {
        production: {energy: -1},
      },

      victoryPoints: VictoryPoints.resource(1, 3),

      metadata: {
        cardNumber: 'Pf29',
        renderData: CardRenderer.builder((b) => {
          b.effect('For every science or Mars tag you play (including these) add 1 data to this card.', (eb) => {
            eb.science(1, {played}).mars(1, {played}).startEffect.data();
          }).br;
          b.minus().production((pb) => pb.energy(1));
        }),
        description: 'Decrease your energy production 1 step. 1 VP for every 3 data here.',
      },
    });
  }


  public onCardPlayed(player: Player, card: ICard) {
    const qty = player.tags.cardTagCount(card, Tag.SCIENCE) + player.tags.cardTagCount(card, Tag. MARS);
    if (qty > 0) player.addResourceTo(this, {qty, log: true});
  }
}
