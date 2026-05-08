import {Card} from '../Card';
import {IActionCard} from '../ICard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {SelectAmount} from '../../inputs/SelectAmount';

export class ZeroGDrillingOperations extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.ZERO_G_DRILLING_OPERATIONS,
      tags: [Tag.SCIENCE, Tag.MOON, Tag.SPACE],
      cost: 31,
      victoryPoints: 2,
      requirements: {tag: Tag.SCIENCE, count: 5},
      behavior: {
        production: {steel: 3},
      },
      metadata: {
        cardNumber: 'B54',
        description: 'Requires 5 Science tags. Increase Steel production 3 steps.',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend X Steel to get X Titanium.', (ab) => {
            ab.text('x').steel(1).startAction.text('x').titanium(1);
          }).br;
          b.production((pb) => pb.steel(3));
        }),
      },
    });
  }

  public canAct(player: IPlayer): boolean {
    return player.steel > 0;
  }

  public action(player: IPlayer) {
    return new SelectAmount('Select amount of Steel to convert to Titanium', 'Convert', 1, player.steel)
      .andThen((amount) => {
        player.stock.deduct(Resource.STEEL, amount);
        player.stock.add(Resource.TITANIUM, amount, {log: true});
        return undefined;
      });
  }
}
