import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {GlobalParameter} from '../../GlobalParameter';

export class TundraFarming extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.TUNDRA_FARMING,
      tags: [Tags.PLANT],
      cost: 16,

      requirements: CardRequirements.builder((b) => b.temperature(-6)),
      metadata: {
        cardNumber: '169',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) =>{
            pb.plants(1).megacredits(2);
          }).plants(1);
        }),
        description: 'Requires -6° C or warmer. Increase your Plant production 1 step and your MC production 2 steps. Gain 1 Plant.',
        victoryPoints: 2,
      },
    });
  }
  public canPlay(player: Player): boolean {
    return player.game.checkMinRequirements(player, GlobalParameter.TEMPERATURE, -6);
  }
  public play(player: Player) {
    player.addProduction(Resources.PLANTS);
    player.addProduction(Resources.MEGACREDITS, 2);
    player.plants++;
    return undefined;
  }
  public getVictoryPoints() {
    return 2;
  }
}
