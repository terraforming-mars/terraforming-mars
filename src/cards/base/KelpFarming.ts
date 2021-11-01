import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class KelpFarming extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.KELP_FARMING,
      tags: [Tags.PLANT],
      cost: 17,
      victoryPoints: 1,

      requirements: CardRequirements.builder((b) => b.oceans(6)),
      metadata: {
        cardNumber: '055',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.megacredits(2).br;
            pb.plants(3);
          }).nbsp.plants(2);
        }),
        description: 'Requires 6 ocean tiles. Increase your M€ production 2 steps and your Plant production 3 steps. Gain 2 Plants.',
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, 2);
    player.addProduction(Resources.PLANTS, 3);
    player.plants += 2;
    return undefined;
  }
}
