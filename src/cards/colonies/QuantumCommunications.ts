import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';
import {Size} from '../render/Size';

export class QuantumCommunications extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 8,
      name: CardName.QUANTUM_COMMUNICATIONS,
      cardType: CardType.AUTOMATED,

      requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 4)),
      metadata: {
        cardNumber: '079',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.megacredits(1).slash().colonies(1, Size.SMALL).any;
          });
        }),
        description: 'Requires 4 Science tags. Increase your M€ production 1 step for each colony in play.',
        victoryPoints: 1,
      },
    });
  }

  public play(player: Player) {
    let coloniesCount: number = 0;
    player.game.colonies.forEach((colony) => {
      coloniesCount += colony.colonies.length;
    });
    player.addProduction(Resources.MEGACREDITS, coloniesCount, {log: true});
    return undefined;
  }

  public getVictoryPoints() {
    return 1;
  }
}
