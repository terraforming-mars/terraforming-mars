import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';

export class TunnelingOperation extends PreludeCard {
  constructor() {
    super({
      name: CardName.TUNNELING_OPERATION,
      tags: [Tag.BUILDING],

      behavior: {
        underworld: {identify: 1, excavate: 2},
        production: {steel: 2},
      },

      metadata: {
        cardNumber: 'UP05',
        renderData: CardRenderer.builder((b) => {
          b.identify(1).excavate(2).production((pb) => pb.steel(2));
        }),
        description: 'Identify 1 underground resource. Then excavate 2 underground resources. Increase your steel production 2 steps.',
      },
    });
  }
}

