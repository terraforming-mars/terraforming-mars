import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../common/Units';

export class GreatDam extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.GREAT_DAM,
      tags: [Tags.ENERGY, Tags.BUILDING],
      cost: 12,
      productionBox: Units.of({energy: 2}),
      victoryPoints: 1,

      requirements: CardRequirements.builder((b) => b.oceans(4)),
      metadata: {
        cardNumber: '136',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(2));
        }),
        description: 'Requires 4 ocean tiles. Increase your Energy production 2 steps.',
      },
    });
  }
  public play(player: Player) {
    player.addProduction(Resources.ENERGY, 2);
    return undefined;
  }
}

