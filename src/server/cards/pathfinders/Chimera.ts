import {CorporationCard} from '../corporation/CorporationCard';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';

export class Chimera extends CorporationCard {
  constructor() {
    super({
      name: CardName.CHIMERA,
      tags: [Tag.WILD, Tag.WILD],
      startingMegaCredits: 36,

      behavior: {
        stock: {steel: 1, titanium: 1},
      },

      metadata: {
        cardNumber: 'PfC5',
        description: 'You start with 36 M€, 1 steel, and 1 titanium.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(36).steel(1).titanium(1);
          b.corpBox('effect', (ce) => {
            ce.effect('When you perform an action, these wild tags count as any tags of your choice. ' +
              'For claiming milestones and funding awards, both symbols count as one. ' +
              '(Other wild tags still do not count toward awards.)',
            (ce) => ce.wild(2, {played}).startEffect.wild(2, {played}).slash().wild(1, {played}).asterix());
          });
        }),
      },
    });
  }
}
