import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card2} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class Grass extends Card2 implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.GRASS,
      tags: [Tag.PLANT],
      cost: 11,
      productionBox: {plants: 1},

      requirements: CardRequirements.builder((b) => b.temperature(-16)),
      metadata: {
        cardNumber: '087',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.plants(1)).plants(3);
        }),
        description: 'Requires -16° C or warmer. Increase your plant production 1 step. Gain 3 plants.',
      },
    });
  }
  public override bespokePlay(player: Player) {
    player.plants += 3;
    return undefined;
  }
}
