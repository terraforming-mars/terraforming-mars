import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../requirements/CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {max} from '../Options';

export class NuclearReactor extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.NUCLEAR_REACTOR,
      tags: [Tag.RADIATION, Tag.POWER],
      cost: 15,

      victoryPoints: {tag: Tag.POWER, per: 2},

      behavior: {
        production: {energy:1, heat: 1},
      },

      requirements: CardRequirements.builder((b) => b.temperature(-8, {max})),
      metadata: {
        description: 'It must be -8 C or colder. Increase your energy and hear production 1 step. Score 1 VP for every 2 power tags you gave.',
        cardNumber: 'N46',
        renderData: CardRenderer.builder((b) => b.production((pb) => pb.energy(1).heat(1))),
      },
    });
  }
}
