import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {SelectAmount} from '../../inputs/SelectAmount';
import {Size} from '../../../common/cards/render/Size';

export class GreenAreasIntegration extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.GREEN_AREAS_INTEGRATION,
      tags: [Tag.SPACE],
      cost: 24,
      victoryPoints: 2,
      metadata: {
        cardNumber: 'B20',
        description: 'Spend 3 Plants to raise your TR 1 step. You can do this up to 5 times.',
        renderData: CardRenderer.builder((b) => {
          b.plants(-3).colon().tr(1).text('[max 5]', Size.SMALL);
        }),
      },
    });
  }

  public override canPlay(player: IPlayer): boolean {
    return player.plants >= 3;
  }

  public override play(player: IPlayer) {
    const max = Math.min(5, Math.floor(player.plants / 3));
    return new SelectAmount('How many times to spend 3 Plants for +1 TR (max 5)', 'Confirm', 1, max)
      .andThen((times) => {
        player.stock.deduct(Resource.PLANTS, times * 3);
        player.increaseTerraformRating(times);
        return undefined;
      });
  }
}
