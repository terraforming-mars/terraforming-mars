
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class BeamFromAThoriumAsteroid extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.BEAM_FROM_A_THORIUM_ASTEROID,
      tags: [Tag.JOVIAN, Tag.SPACE, Tag.ENERGY],
      cost: 32,
      victoryPoints: 1,

      behavior: {
        production: {heat: 3, energy: 3},
      },

      requirements: CardRequirements.builder((b) => b.tag(Tag.JOVIAN)),
      metadata: {
        cardNumber: '058',
        description: 'Requires a Jovian tag. Increase your heat production and energy production 3 steps each',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.heat(3).br;
            pb.energy(3);
          });
        }),
      },
    });
  }
}
