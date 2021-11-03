import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class TundraFarming extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.TUNDRA_FARMING,
      tags: [Tags.PLANT],
      cost: 16,
      victoryPoints: 2,

      requirements: CardRequirements.builder((b) => b.temperature(-6)),
      metadata: {
        cardNumber: '169',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) =>{
            pb.plants(1).megacredits(2);
          }).plants(1);
        }),
        description: 'Requires -6° C or warmer. Increase your Plant production 1 step and your M€ production 2 steps. Gain 1 Plant.',
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.PLANTS, 1);
    player.addProduction(Resources.MEGACREDITS, 2);
    player.plants++;
    return undefined;
  }
}
