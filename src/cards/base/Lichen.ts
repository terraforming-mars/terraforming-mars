import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class Lichen extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.LICHEN,
      tags: [Tags.PLANT],
      cost: 7,

      requirements: CardRequirements.builder((b) => b.temperature(-24)),
      metadata: {
        cardNumber: '159',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.plants(1));
        }),
        description: 'Requires -24 C or warmer. Increase your Plant production 1 step.',
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.PLANTS, 1);
    return undefined;
  }
}

