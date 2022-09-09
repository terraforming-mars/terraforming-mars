import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {PreludeCard} from '../prelude/PreludeCard';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';

export class LunarPlanningOffice extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.LUNAR_PlANNING_OFFICE,
      tags: [Tag.MOON, Tag.BUILDING],

      behavior: {
        stock: {steel: 6},
        drawCard: {tag: Tag.MOON, count: 2},
      },

      metadata: {
        description: 'Draw 2 cards with Moon tag. Gain 6 steel.',
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.cards(2, {secondaryTag: Tag.MOON}).br.steel(6);
        }),
      },
    });
  }
}
