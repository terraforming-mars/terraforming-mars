import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardName} from '../../common/cards/CardName';
import {CardType} from '../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';

export class MeatIndustry extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.MEAT_INDUSTRY,
      tags: [Tags.BUILDING],
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

  public play() {
    return undefined;
  }
}
