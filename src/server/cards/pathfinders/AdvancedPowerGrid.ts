import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {played} from '../Options';

export class AdvancedPowerGrid extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.ADVANCED_POWER_GRID,
      cost: 18,
      tags: [Tag.ENERGY, Tag.BUILDING, Tag.MARS],

      behavior: {
        production: {megacredits: {tag: Tag.ENERGY}, energy: 2},
      },

      metadata: {
        cardNumber: 'Pf56',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(2).br.megacredits(1).slash().energy(1, {played}));
        }),
        description: 'Increase your energy production 2 steps. Increase your M€ production 1 step per power tag you have, including this.',
      },
    });
  }
}

