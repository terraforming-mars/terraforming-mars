import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {Resources} from '../../../common/Resources';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';
import {Size} from '../../../common/cards/render/Size';
import {all} from '../Options';

export class QuantumCommunications extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 8,
      name: CardName.QUANTUM_COMMUNICATIONS,
      cardType: CardType.AUTOMATED,
      requirements: CardRequirements.builder((b) => b.tag(Tag.SCIENCE, 4)),
      victoryPoints: 1,

      metadata: {
        cardNumber: '079',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.megacredits(1).slash().colonies(1, {size: Size.SMALL, all});
          });
        }),
        description: 'Requires 4 science tags. Increase your M€ production 1 step for each colony in play.',
      },
    });
  }

  public override bespokePlay(player: Player) {
    let coloniesCount = 0;
    player.game.colonies.forEach((colony) => {
      coloniesCount += colony.colonies.length;
    });
    player.production.add(Resources.MEGACREDITS, coloniesCount, {log: true});
    return undefined;
  }
}
