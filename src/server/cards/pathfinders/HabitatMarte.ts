import {Card} from '../Card';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';

export class HabitatMarte extends Card implements ICorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.HABITAT_MARTE,
      tags: [Tag.MARS],
      startingMegaCredits: 40,

      metadata: {
        cardNumber: 'PfC22',
        description: 'You start with 40 M€.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(40);
          b.corpBox('effect', (ce) => {
            ce.effect('Mars tags also count as science tags.', (eb) => {
              eb.mars(1, {played}).startEffect.science(1, {played});
            });
          });
        }),
      },
    });
  }
  // Behavior in Player.getTagCount
}
