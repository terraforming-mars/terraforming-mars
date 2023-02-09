import {Tag} from '../../../common/cards/Tag';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class ResearchNetwork extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.RESEARCH_NETWORK,
      tags: [Tag.WILD],

      behavior: {
        production: {megacredits: 1},
        drawCard: 3,
      },

      metadata: {
        cardNumber: 'P28',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1)).br;
          b.cards(3);
        }),
        description: 'Increase your M€ production 1 step. Draw 3 cards. After being played, when you perform an action, the wild tag counts as any tag of your choice.',
      },
    });
  }
}
