import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';
import {all} from '../Options';

export class HE3FusionPlant extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.HE3_FUSION_PLANT,
      cardType: CardType.AUTOMATED,
      tags: [Tag.ENERGY, Tag.ENERGY, Tag.MOON],
      cost: 12,

      behavior: {
        production: {energy: {moon: {mine: {}}}},
      },

      requirements: CardRequirements.builder((b) => b.miningRate(2)),
      metadata: {
        description: 'Requires Mining Rate of 2 or higher. ' +
            'Increase your energy production 1 step for each mining tile on The Moon.',
        cardNumber: 'M48',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(1)).slash().moonMine({all});
        }),
      },
    });
  }
}
