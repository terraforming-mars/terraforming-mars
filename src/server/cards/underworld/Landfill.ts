import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {Units} from '../../../common/Units';

export class Landfill extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.LANDFILL,
      tags: [Tag.BUILDING],
      cost: 2,

      victoryPoints: -2,

      metadata: {
        cardNumber: 'U36',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1, {text: '?'})).asterix();
        }),
        description: 'Increase your M€ production 1 step for each different TYPE of production ' +
          'you have at least 1 step of.',
      },
    });
  }

  public productionBox(player: IPlayer) {
    const count = Units.keys.filter((type) => player.production[type] > 0).length;
    return Units.of({megacredits: count});
  }


  override bespokePlay(player: IPlayer) {
    player.production.adjust(this.productionBox(player), {log: true});
    return undefined;
  }
}
