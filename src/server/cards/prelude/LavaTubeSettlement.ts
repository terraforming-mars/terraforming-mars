import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {PlaceCityTile} from '../../deferredActions/PlaceCityTile';
import {CardRenderer} from '../render/CardRenderer';
import {Space} from '../../boards/Space';
import {intersection} from '@/common/utils/utils';

export class LavaTubeSettlement extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.LAVA_TUBE_SETTLEMENT,
      tags: [Tag.BUILDING, Tag.CITY],
      cost: 15,

      behavior: {
        production: {energy: -1, megacredits: 2},
      },

      metadata: {
        cardNumber: 'P37',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.energy(-1).br;
            pb.plus().megacredits(2);
          }).br;
          b.city().asterix();
        }),
        description: 'Decrease your energy production 1 step and increase your M€ production 2 steps. Place a city tile on a VOLCANIC AREA regardless of adjacent cities.',
      },
    });
  }

  private getSpacesForCity(player: IPlayer): ReadonlyArray<Space> {
    const board = player.game.board;
    // https://boardgamegeek.com/thread/1953628/article/29627211#29627211
    if (board.volcanicSpaceIds.length === 0) {
      return board.getAvailableSpacesForType(player, 'city');
    }
    const volcanicSpaces = board.getAvailableSpacesForType(player, 'volcanic');
    // Kingdom of Tauraro must place next to its own tiles or excavation markers, if possible.
    if (player.tableau.has(CardName.KINGDOM_OF_TAURARO)) {
      const spaces = intersection(board.getAvailableSpacesForType(player, 'city'), volcanicSpaces);
      if (spaces.length > 0) {
        return spaces;
      }
    }
    return volcanicSpaces;
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    return this.getSpacesForCity(player).length > 0 && player.production.energy >= 1;
  }

  public override bespokePlay(player: IPlayer) {
    player.game.defer(
      new PlaceCityTile(
        player,
        {
          spaces: this.getSpacesForCity(player),
          title: 'Select either Tharsis Tholus, Ascraeus Mons, Pavonis Mons or Arsia Mons',
        }));
    return undefined;
  }
}
