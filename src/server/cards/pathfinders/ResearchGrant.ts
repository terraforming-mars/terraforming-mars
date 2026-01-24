import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';

export class ResearchGrant extends PreludeCard {
  constructor() {
    super({
      name: CardName.RESEARCH_GRANT_PATHFINDERS,
      tags: [Tag.SCIENCE, Tag.SCIENCE],

      behavior: {
        production: {energy: 1},
        stock: {megacredits: 14},
      },

      metadata: {
        cardNumber: 'PfP05',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(1)).br;
          b.megacredits(14);
        }),
        description: 'Increase your energy production 1 step. Gain 14 M€.',
      },
    });
  }
}

