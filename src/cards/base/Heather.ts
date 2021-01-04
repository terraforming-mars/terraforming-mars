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

export class Heather extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.HEATHER,
      tags: [Tags.PLANT],
      cost: 6,

      metadata: {
        cardNumber: '178',
        requirements: CardRequirements.builder((b) => b.temperature(-14)),
        renderData: CardRenderer.builder((b) => {
          b.productionBox((pb) => pb.plants(1)).plants(1);
        }),
        description: 'Requires -14 C° or warmer. Increase your plant production 1 step. Gain 1 plant.',
      },
    });
  }
  public canPlay(player: Player, game: Game): boolean {
    return game.checkMinRequirements(player, GlobalParameter.TEMPERATURE, -14);
  }
  public play(player: Player) {
    player.addProduction(Resources.PLANTS);
    player.plants++;
    return undefined;
  }
}
