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

export class KelpFarming extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.KELP_FARMING,
      tags: [Tags.PLANT],
      cost: 17,

      metadata: {
        cardNumber: '055',
        requirements: CardRequirements.builder((b) => b.oceans(6)),
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.megacredits(2).br;
            pb.plants(3);
          }).nbsp.plants(2);
        }),
        description: 'Requires 6 ocean tiles. Increase your MC production 2 steps and your Plant production 3 steps. Gain 2 Plants.',
        victoryPoints: 1,
      },
    });
  }

  public canPlay(player: Player, game: Game): boolean {
    return game.checkMinRequirements(player, GlobalParameter.OCEANS, 6);
  }
  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, 2);
    player.addProduction(Resources.PLANTS, 3);
    player.plants += 2;
    return undefined;
  }
  public getVictoryPoints() {
    return 1;
  }
}
