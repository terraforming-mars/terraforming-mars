import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {GlobalParameter} from '../../GlobalParameter';

export class Algae extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.ALGAE,
      tags: [Tags.PLANT],
      cost: 10,

      metadata: {
        description: 'Requires 5 ocean tiles. Gain 1 Plant and increase your Plant production 2 steps.',
        cardNumber: '047',
        requirements: CardRequirements.builder((b) => b.oceans(5)),
        renderData: CardRenderer.builder((b) => b.productionBox((pb) => pb.plants(2)).plants(1)),
      },
    });
  }
  public canPlay(player: Player, game: Game): boolean {
    return game.checkMinRequirements(player, GlobalParameter.OCEANS, 5);
  }
  public play(player: Player) {
    player.plants++;
    player.addProduction(Resources.PLANTS, 2);
    return undefined;
  }
}
