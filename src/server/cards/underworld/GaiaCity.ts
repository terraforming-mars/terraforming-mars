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
      cost: 18,
      tags: [Tag.MARS, Tag.BUILDING, Tag.CITY],

      behavior: {production: {energy: -1, megacredits: 2}},

      metadata: {
        cardNumber: 'U05',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.minus().energy(1).megacredits(2)).br;
          b.city().super((b) => b.excavate(1)).asterix().text('Placement Bonus x2');
        }),
        description: 'Reduce your energy production one step and increase your M€ production 2 steps. ' +
        'Place a city in a space with ANY player\'s excavation marker. ' +
        'Its placement bonus is doubled (including adjacencies.) Regular placement restriction still apply.',
      },
    });
  }

  private availableSpaces(player: IPlayer, cost: number) {
    const availableSpaceForCity = player.game.board.getAvailableSpacesForCity(
      player, {cost: cost, bonusMultiplier: 2});
    return availableSpaceForCity.filter((space) => space.excavator !== undefined);
  }

  public override bespokeCanPlay(player: IPlayer) {
    return this.availableSpaces(player, player.getCardCost(this)).length > 0;
  }

  public override bespokePlay(player: IPlayer) {
    player.game.defer(new PlaceCityTile(player, {
      spaces: this.availableSpaces(player, 0),
    })).andThen((space) => {
      if (space) {
        player.game.grantPlacementBonuses(player, space);
      }
    });
    return undefined;
  }
}
