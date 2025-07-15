import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IPlayer} from '../../IPlayer';
import {PlaceCityTile} from '../../deferredActions/PlaceCityTile';
import {Tag} from '../../../common/cards/Tag';

export class GaiaCity extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.GAIA_CITY,
      type: CardType.AUTOMATED,
      cost: 20,
      tags: [Tag.PLANT, Tag.BUILDING, Tag.CITY],

      behavior: {production: {energy: -1, plants: 2}},

      metadata: {
        cardNumber: 'U005',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.minus().energy(1).plants(2)).br;
          b.city().super((b) => b.excavate(1)).asterix();
        }),
        description: 'Reduce your energy production one step and increase your plant production 2 steps. ' +
          'Place a city on a NON-RESERVED SPACE WITH YOUR EXCAVATION MARKER, ignoring other placement restrictions',
      },
    });
  }

  private availableSpaces(player: IPlayer, cost: number) {
    return player.game.board.getAvailableSpacesOnLand(player, {cost: cost})
      .filter((space) => space.excavator === player);
  }

  public override bespokeCanPlay(player: IPlayer) {
    return this.availableSpaces(player, player.getCardCost(this)).length > 0;
  }

  public override bespokePlay(player: IPlayer) {
    player.game.defer(new PlaceCityTile(player, {spaces: this.availableSpaces(player, 0)}));
    return undefined;
  }
}
