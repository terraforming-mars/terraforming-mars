import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';

export class NoctisFarming extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.NOCTIS_FARMING,
      tags: [Tags.PLANT, Tags.BUILDING],
      cost: 10,
      productionDelta: Units.of({megacredits: 1}),

      metadata: {
        cardNumber: '176',
        requirements: CardRequirements.builder((b) => b.temperature(-20)),
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.megacredits(1);
          }).nbsp.plants(2);
        }),
        description: 'Requires -20 C or warmer. Increase your MC production 1 step and gain 2 Plants.',
        victoryPoints: 1,
      },
    });
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
