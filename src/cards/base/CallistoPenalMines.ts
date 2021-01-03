
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class CallistoPenalMines extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.CALLISTO_PENAL_MINES,
      tags: [Tags.JOVIAN, Tags.SPACE],
      cost: 24,

      metadata: {
        description: 'Increase your MC production 3 steps.',
        cardNumber: '082',
        renderData: CardRenderer.builder((b) => b.productionBox((pb) => {
          pb.megacredits(3);
        })),
        victoryPoints: 2,
      },
    });
  }
  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, 3);
    return undefined;
  }
  public getVictoryPoints() {
    return 2;
  }
}
