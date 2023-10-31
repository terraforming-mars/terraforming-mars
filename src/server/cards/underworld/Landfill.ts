import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {Units} from '../../../common/Units';
import {Resource} from '../../../common/Resource';

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
          b.production((pb) => pb.megacredits(1).slash().production((pb2) => pb2.text('1+').wild(1)).asterix());
        }),
        description: 'Increase your M€ production 1 step for each different TYPE of production ' +
          'you have at least 1 step of.',
      },
    });
  }

  public produce(player: IPlayer) {
    const count = Units.keys.filter((type) => player.production[type] > 0).length;
    player.production.add(Resource.MEGACREDITS, count, {log: true});
  }


  override bespokePlay(player: IPlayer) {
    this.produce(player);
    return undefined;
  }
}
