import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Resources} from '../../../common/Resources';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {all} from '../Options';

export class BiomassCombustors extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.BIOMASS_COMBUSTORS,
      tags: [Tag.ENERGY, Tag.BUILDING],
      cost: 4,
      victoryPoints: -1,

      // This might not work for Robotic Workforce yet.
      behavior: {
        decreaseAnyProduction: {type: Resources.PLANTS, count: 1},
        production: {energy: 2},
      },

      requirements: CardRequirements.builder((b) => b.oxygen(6)),
      metadata: {
        description: 'Requires 6% oxygen. Decrease any plant production 1 step and increase your energy production 2 steps.',
        cardNumber: '183',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().plants(-1, {all}).br;
            pb.plus().energy(2);
          });
        }),
      },
    });
  }
}
