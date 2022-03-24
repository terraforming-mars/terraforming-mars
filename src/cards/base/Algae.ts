import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class Algae extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.ALGAE,
      tags: [Tags.PLANT],
      cost: 10,

      requirements: CardRequirements.builder((b) => b.oceans(5)),
      metadata: {
        description: 'Requires 5 ocean tiles. Gain 1 Plant and increase your Plant production 2 steps.',
        cardNumber: '047',
        renderData: CardRenderer.builder((b) => b.production((pb) => pb.plants(2)).plants(1)),
      },
    });
  }
  public play(player: Player) {
    player.plants++;
    player.addProduction(Resources.PLANTS, 2);
    return undefined;
  }
}
