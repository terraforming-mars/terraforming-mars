import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Size} from '../../../common/cards/render/Size';
import {all} from '../Options';

export class MolecularPrinting extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 11,
      tags: [Tag.SCIENCE],
      name: CardName.MOLECULAR_PRINTING,
      type: CardType.AUTOMATED,
      victoryPoints: 1,

      behavior: {
        stock: {megacredits: {cities: {}, colonies: {colonies: {}}, all}},
      },

      metadata: {
        cardNumber: 'C27',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(1).slash().city({size: Size.SMALL, all}).br;
          b.megacredits(1).slash().colonies(1, {size: Size.SMALL, all});
        }),
        description: 'Gain 1 M€ for each city tile in play. Gain 1 M€ for each colony in play.',
      },
    });
  }
}
