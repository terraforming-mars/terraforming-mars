import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {Resource} from '../../../common/Resource';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Size} from '../../../common/cards/render/Size';
import {all} from '../Options';

export class QuantumCommunications extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 8,
      name: CardName.QUANTUM_COMMUNICATIONS,
      type: CardType.AUTOMATED,
      requirements: {tag: Tag.SCIENCE, count: 4},
      victoryPoints: 1,

      metadata: {
        cardNumber: 'C31',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.megacredits(1).slash().colonies(1, {size: Size.SMALL, all});
          });
        }),
        description: 'Requires 4 science tags. Increase your M€ production 1 step for each colony in play.',
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    let coloniesCount = 0;
    player.game.colonies.forEach((colony) => {
      coloniesCount += colony.colonies.length;
    });
    player.production.add(Resource.MEGACREDITS, coloniesCount, {log: true});
    return undefined;
  }
}
