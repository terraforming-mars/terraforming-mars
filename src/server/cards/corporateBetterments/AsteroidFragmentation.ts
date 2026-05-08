// ============================================================
// Asteroid Fragmentation - B06
// Event: Pay 6 Heat, 3 Steel, 3 Titanium to raise TR 3 steps.
// ============================================================
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';

export class AsteroidFragmentation extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.ASTEROID_FRAGMENTATION,
      tags: [Tag.SPACE],
      cost: 3,

      metadata: {
        cardNumber: 'B06',
        description: 'Pay 6 Heat, 3 Steel, and 3 Titanium to raise your TR 3 steps.',
        renderData: CardRenderer.builder((b) => {
          b.minus().heat(6).minus().steel(3).minus().titanium(3).tr(3);
        }),
      },
    });
  }

  public override canPlay(player: IPlayer): boolean {
    return player.heat >= 6 && player.steel >= 3 && player.titanium >= 3;
  }

  public override play(player: IPlayer) {
    player.stock.deduct(Resource.HEAT, 6);
    player.stock.deduct(Resource.STEEL, 3);
    player.stock.deduct(Resource.TITANIUM, 3);
    player.increaseTerraformRating(3);
    return undefined;
  }
}
