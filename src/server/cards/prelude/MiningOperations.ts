import {Tag} from '@/common/cards/Tag';
import {PreludeCard} from '@/server/cards/prelude/PreludeCard';
import {IProjectCard} from '@/server/cards/IProjectCard';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';

export class MiningOperations extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.MINING_OPERATIONS,
      tags: [Tag.BUILDING],

      behavior: {
        production: {steel: 2},
        stock: {steel: 4},
      },

      metadata: {
        cardNumber: 'P21',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.steel(2)).br;
          b.steel(4);
        }),
        description: 'Increase your steel production 2 steps. Gain 4 steel.',
      },
    });
  }
}
