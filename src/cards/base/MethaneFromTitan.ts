import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {GlobalParameter} from '../../GlobalParameter';

export class MethaneFromTitan extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.METHANE_FROM_TITAN,
      tags: [Tags.JOVIAN, Tags.SPACE],
      cost: 28,

      metadata: {
        description: 'Requires 2% oxygen. Increase your heat production 2 steps and your plant production 2 steps.',
        cardNumber: '018',
        requirements: CardRequirements.builder((b) => b.oxygen(2)),
        renderData: CardRenderer.builder((b) => b.productionBox((pb) => {
          pb.heat(2).br;
          pb.plants(2);
        })),
        victoryPoints: 2,
      },
    });
  }

  public canPlay(player: Player, game: Game): boolean {
    return game.checkMinRequirements(player, GlobalParameter.OXYGEN, 2);
  }
  public play(player: Player) {
    player.addProduction(Resources.HEAT, 2);
    player.addProduction(Resources.PLANTS, 2);
    return undefined;
  }
  public getVictoryPoints() {
    return 2;
  }
}
