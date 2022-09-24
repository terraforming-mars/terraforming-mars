import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {CardRequirements} from '../CardRequirements';

export class HydrogenProcessingPlant extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.HYDROGEN_PROCESSING_PLANT,
      cost: 9,
      tags: [Tag.BUILDING, Tag.ENERGY],
      requirements: CardRequirements.builder((b) => b.oxygen(3)),
      victoryPoints: -1,

      behavior: {
        global: {oxygen: -1},
        production: {energy: {oceans: {}, per: 2}},
      },

      metadata: {
        cardNumber: 'Pf19',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(1)).slash().oceans(2).br;
          b.minus().oxygen(1).br;
        }),
        description: 'Oxygen level must be 3% or higher. Decrease oxygen level 1% ' +
          'Raise your energy production 1 step for every two ocean tiles on Mars.',
      },
    });
  }
}

