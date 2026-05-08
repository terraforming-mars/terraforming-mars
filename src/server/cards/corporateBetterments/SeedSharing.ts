import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {all} from '../Options';

export class SeedSharing extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.SEED_SHARING,
      tags: [Tag.PLANT, Tag.SCIENCE],
      cost: 17,
      requirements: {production: Resource.PLANTS, count: 1, all: true},
      behavior: {
        production: {plants: 2},
        stock: {plants: 2},
      },
      metadata: {
        cardNumber: 'B33',
        description: 'Requires a player to have Plant production. Increase your Plant production 2 steps. Every player gets 2 Plants.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.plants(2)).br;
          b.plants(2, {all});
        }),
      },
    });
  }

  public override play(player: IPlayer) {
    for (const other of player.game.players) {
      if (other !== player) other.stock.add(Resource.PLANTS, 2, {log: true});
    }
    return undefined;
  }
}
