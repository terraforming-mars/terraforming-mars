import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {PlaceGreeneryTile} from '../../deferredActions/PlaceGreeneryTile';

export class AssistedGrowthPlants extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.ASSISTED_GROWTH_PLANTS,
      tags: [Tag.PLANT, Tag.SCIENCE],
      cost: 35,
      requirements: {oxygen: 14},
      metadata: {
        cardNumber: 'B45',
        description: 'Requires Oxygen at maximum. Place 3 Greenery tiles.',
        renderData: CardRenderer.builder((b) => {
          b.greenery().greenery().greenery();
        }),
      },
    });
  }

  public override play(player: IPlayer) {
    player.game.defer(new PlaceGreeneryTile(player));
    player.game.defer(new PlaceGreeneryTile(player));
    player.game.defer(new PlaceGreeneryTile(player));
    return undefined;
  }
}
