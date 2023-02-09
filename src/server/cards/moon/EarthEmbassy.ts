import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {played} from '../Options';

export class EarthEmbassy extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.EARTH_EMBASSY,
      cardType: CardType.ACTIVE,
      tags: [Tag.MOON, Tag.EARTH],
      cost: 16,

      metadata: {
        cardNumber: 'M77',
        renderData: CardRenderer.builder((b) => {
          b.effect('After being played, when you perform an action, your Moon tags count as Earth tags, but not vice versa.', (eb) => {
            eb.empty().startEffect.moon().equals().earth(1, {played});
          });
        }),
      },
    });
  }
}
