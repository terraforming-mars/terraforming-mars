import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class StagedProtests extends Card implements IProjectCard {
  public generationUsed: number = -1;

  constructor() {
    super({
      name: CardName.STAGED_PROTESTS,
      type: CardType.EVENT,
      cost: 6,

      requirements: {corruption: 1},

      behavior: {
        underworld: {
          corruption: 1,
          markThisGeneration: {},
        },
      },

      metadata: {
        cardNumber: 'U66',
        renderData: CardRenderer.builder((b) => {
          b.corruption(1).br;
          // TODO(kberg): replace with award().slash.milestone() when award and milestone can be stacked.
          b.plate('Awards and Milestones').colon().megacredits(8).asterix();
        }),
        description: 'Requires 1 corruption. Gain 1 corruption. Until the end of this generation, milestones and awards cost +8 M€.',
      },
    });
  }
}
