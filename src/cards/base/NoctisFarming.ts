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

export class NoctisFarming extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.NOCTIS_FARMING,
      tags: [Tags.PLANT, Tags.BUILDING],
      cost: 10,

      metadata: {
        cardNumber: '176',
        requirements: CardRequirements.builder((b) => b.temperature(-20)),
        renderData: CardRenderer.builder((b) => {
          b.productionBox((pb) => {
            pb.megacredits(1);
          }).nbsp.plants(2);
        }),
        description: 'Requires -20 C or warmer. Increase your MC production 1 step and gain 2 Plants.',
        victoryPoints: 1,
      },
    });
  }

  public canPlay(player: Player, game: Game): boolean {
    return game.checkMinRequirements(player, GlobalParameter.TEMPERATURE, -20);
  }
  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS);
    player.plants += 2;
    return undefined;
  }
  public getVictoryPoints() {
    return 1;
  }
}
