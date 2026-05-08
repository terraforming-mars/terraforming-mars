import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {PlaceCityTile} from '../../deferredActions/PlaceCityTile';

export class MassUrbanization extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.MASS_URBANIZATION,
      tags: [Tag.CITY, Tag.CITY, Tag.CITY],
      cost: 69,
      victoryPoints: 3,
      requirements: {cities: 3},
      metadata: {
        cardNumber: 'B41',
        description: 'Requires you own 3 Cities on Mars. Place 3 City tiles.',
        renderData: CardRenderer.builder((b) => {
          b.city().city().city();
        }),
      },
    });
  }

  public override play(player: IPlayer) {
    player.game.defer(new PlaceCityTile(player));
    player.game.defer(new PlaceCityTile(player));
    player.game.defer(new PlaceCityTile(player));
    return undefined;
  }
}
