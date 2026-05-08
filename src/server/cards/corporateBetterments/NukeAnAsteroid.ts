import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {all} from '../Options';

export class NukeAnAsteroid extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.NUKE_AN_ASTEROID,
      tags: [Tag.SPACE],
      cost: 16,
      behavior: {
        production: {titanium: 2},
      },
      metadata: {
        cardNumber: 'B36',
        description: 'Increase your Titanium production 2 steps. Distribute 5 Titanium among any number of other players.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.titanium(2)).br;
          b.titanium(5, {all});
        }),
      },
    });
  }

  public override play(player: IPlayer) {
    const opponents = player.game.players.filter((p) => p !== player);
    if (opponents.length === 0) return undefined;
    const each = Math.floor(5 / opponents.length);
    const remainder = 5 % opponents.length;
    opponents.forEach((opp, i) => {
      const amount = each + (i === 0 ? remainder : 0);
      if (amount > 0) opp.stock.add(Resource.TITANIUM, amount, {log: true});
    });
    return undefined;
  }
}
