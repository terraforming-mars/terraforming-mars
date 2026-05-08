import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {CardResource} from '../../../common/CardResource';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {Size} from '../../../common/cards/render/Size';

export class VenusianCollaboration extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.VENUSIAN_COLLABORATION,
      tags: [Tag.MARS, Tag.VENUS],
      cost: 21,
      requirements: {floaters: 1},
      metadata: {
        cardNumber: 'B14',
        description: 'Requires you own at least 1 Floater. Raise your TR 1 step per 10% of Venus. Raise your Heat production 1 step per 10% of Venus. Add 3 Floaters to any card.',
        renderData: CardRenderer.builder((b) => {
          b.tr(1).slash().venus(10, {size: Size.SMALL}).br;
          b.production((pb) => pb.heat(1)).slash().venus(10, {size: Size.SMALL}).br;
          b.resource(CardResource.FLOATER, 3).asterix();
        }),
      },
    });
  }

  public override play(player: IPlayer) {
    const venusLevel = player.game.getVenusScaleLevel();
    const steps = Math.floor(venusLevel / 10);
    if (steps > 0) {
      player.increaseTerraformRating(steps);
      player.production.add(Resource.HEAT, steps, {log: true});
    }
    player.game.defer(new AddResourcesToCard(player, CardResource.FLOATER, {count: 3}));
    return undefined;
  }
}
