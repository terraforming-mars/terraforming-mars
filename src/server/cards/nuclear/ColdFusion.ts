import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import { CardRequirements } from '../requirements/CardRequirements';
import {all} from '../Options';
import { digit } from '../Options';


export class ColdFusion extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.COLD_FUSION,
      cost: 13,
      tags: [Tag.SCIENCE, Tag.POWER],
      victoryPoints: -1,
      requirements: CardRequirements.builder((b) => b.tag(Tag.RADIATION, 6, {all})),

      behavior: {
        production: {energy: 5},
        tr: 2,
      },

      metadata: {
        cardNumber: 'N15',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(5, {digit})).br;
          b.tr(2);
        }),
        description: 'Requires 6 radiation tags in play. Increase your energy production 5 steps. Gain 2 TR.',
      },
    });
  }
}
