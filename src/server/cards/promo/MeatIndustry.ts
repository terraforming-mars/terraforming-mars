import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Player} from '../../Player';
import {ICard} from '../ICard';
import {CardResource} from '../../../common/CardResource';

export class MeatIndustry extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.MEAT_INDUSTRY,
      tags: [Tag.BUILDING],
      cost: 5,

      metadata: {
        cardNumber: 'X25',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you gain an animal to ANY CARD, gain 2 M€.', (eb) => {
            eb.animals(1).asterix().startEffect.megacredits(2);
          });
        }),
      },
    });
  }

  public onResourceAdded(player: Player, card: ICard, count: number) {
    if (card.resourceType === CardResource.ANIMAL) {
      player.megaCredits += count * 2;
    }
  }
}
