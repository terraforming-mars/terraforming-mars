import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {max} from '../Options';
import {IPlayer} from '../../IPlayer';
import {SpaceType} from '../../../common/boards/SpaceType';
import {isHazardTileType} from '../../../common/AresTileType';
import {Resource} from '../../../common/Resource';
import {Space} from '../..//boards/Space';

export class HermeticOrderofMars extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.HERMETIC_ORDER_OF_MARS,
      cost: 10,

      requirements: {oxygen: 4, max},

      behavior: {
        production: {megacredits: 2},
      },

      metadata: {
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(2)).nbsp.megacredits(1).slash().emptyTile().asterix();
        }),
        description: 'Oxygen must be 4% or lower. Increase your M€ production 2 steps. Gain 1 M€ per empty area adjacent to your tiles.',
      },
    });
  }

  private hasTile(space: Space): boolean {
    return space.spaceType !== SpaceType.RESTRICTED && space.tile !== undefined && !isHazardTileType(space.tile.tileType);
  }

  public override bespokePlay(player: IPlayer) {
    const board = player.game.board;
    const spaces = board.spaces.filter((space) => {
      if (space.spaceType === SpaceType.COLONY || this.hasTile(space)) {
        return false;
      }
      return board.getAdjacentSpaces(space).some((s) => s.player === player && this.hasTile(s));
    }).length;

    player.stock.add(Resource.MEGACREDITS, spaces, {log: true});
    return undefined;
  }
}
