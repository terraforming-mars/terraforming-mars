import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';

export class Windmills extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.WINDMILLS,
      tags: [Tags.ENERGY, Tags.BUILDING],
      cost: 6,
      productionBox: Units.of({energy: 1}),
      victoryPoints: 1,

      requirements: CardRequirements.builder((b) => b.oxygen(7)),
      metadata: {
        cardNumber: '168',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(1));
        }),
        description: 'Requires 7% oxygen. Increase your Energy production 1 step.',
      },
    });
  }

  public play(player: Player): PlayerInput | undefined {
    player.addProduction(Resources.ENERGY, 1);
    return undefined;
  }
}
