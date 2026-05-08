import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {CardResource} from '../../../common/CardResource';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {Size} from '../../../common/cards/render/Size';

export class TwinPlanetCommerceNetwork extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.TWIN_PLANET_COMMERCE_NETWORK,
      tags: [Tag.EARTH, Tag.VENUS],
      cost: 28,
      requirements: {floaters: 1},
      metadata: {
        cardNumber: 'B44',
        description: 'Requires you own at least 1 Floater. Raise your TR 1 step for each off-world City in play. Add 3 Floaters to any card.',
        renderData: CardRenderer.builder((b) => {
          b.tr(1).slash().city({size: Size.SMALL}).asterix().br;
          b.resource(CardResource.FLOATER, 3).asterix();
        }),
      },
    });
  }

  public override play(player: IPlayer) {
    const moonCities = player.game.moonData?.moon.spaces
      .filter((s) => s.tile !== undefined).length ?? 0;
    player.increaseTerraformRating(moonCities);
    player.game.defer(new AddResourcesToCard(player, CardResource.FLOATER, {count: 3}));
    return undefined;
  }
}
