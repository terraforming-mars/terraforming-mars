import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {all} from '../Options';

export class JovianBeltMiningOperations extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.JOVIAN_BELT_MINING_OPERATIONS,
      tags: [Tag.JOVIAN, Tag.SPACE],
      cost: 19,
      victoryPoints: 2,
      behavior: {
        production: {titanium: 2},
      },
      metadata: {
        cardNumber: 'B10',
        description: 'Increase your Titanium production 2 steps. Other players increase their Titanium production 1 step.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.titanium(2)).br;
          b.production((pb) => pb.titanium(1, {all}));
        }),
      },
    });
  }

  public override play(player: IPlayer) {
    for (const other of player.game.players) {
      if (other !== player) {
        other.production.add(Resource.TITANIUM, 1, {log: true});
      }
    }
    return undefined;
  }
}
