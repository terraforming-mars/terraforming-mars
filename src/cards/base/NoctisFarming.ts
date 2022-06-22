import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../common/Units';

export class NoctisFarming extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.NOCTIS_FARMING,
      tags: [Tags.PLANT, Tags.BUILDING],
      cost: 10,
      productionBox: Units.of({megacredits: 1}),
      requirements: CardRequirements.builder((b) => b.temperature(-20)),
      victoryPoints: 1,

      metadata: {
        cardNumber: '176',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.megacredits(1);
          }).nbsp.plants(2);
        }),
        description: 'Requires -20 C or warmer. Increase your M€ production 1 step and gain 2 Plants.',
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, 1);
    player.plants += 2;
    return undefined;
  }
}
