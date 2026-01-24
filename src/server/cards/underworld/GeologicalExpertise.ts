import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {digit} from '../Options';

export class GeologicalExpertise extends PreludeCard {
  constructor() {
    super({
      name: CardName.GEOLOGICAL_EXPERTISE,

      behavior: {
        drawCard: {tag: Tag.SCIENCE, count: 2},
        underworld: {identify: {count: 4, claim: 1}},
      },

      metadata: {
        cardNumber: 'UP06',
        renderData: CardRenderer.builder((b) => {
          b.identify(4, {digit}).claim(1).cards(2, {secondaryTag: Tag.SCIENCE});
        }),
        description: 'Identify 4 underground resources. Claim one of them. Draw 2 cards with science tags.',
      },
    });
  }
}

