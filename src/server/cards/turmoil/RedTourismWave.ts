import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Resource} from '../../../common/Resource';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {Card} from '../Card';
import {isHazardTileType} from '../../../common/AresTileType';
import {Space} from '../../../server/boards/Space';
import {SpaceType} from '../../../common/boards/SpaceType';

export class RedTourismWave extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 3,
      tags: [Tag.EARTH],
      name: CardName.RED_TOURISM_WAVE,
      type: CardType.EVENT,

      requirements: {party: PartyName.REDS},
      metadata: {
        cardNumber: 'T12',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(1).slash().emptyTile('normal', {size: Size.SMALL}).asterix();
        }),
        description: 'Requires that Reds are ruling or that you have 2 delegates there. Gain 1 M€ from each EMPTY AREA ADJACENT TO YOUR TILES',
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    const amount = RedTourismWave.getAdjacentEmptySpacesCount(player);
    player.stock.add(Resource.MEGACREDITS, amount, {log: true});
    return undefined;
  }

  private static hasRealTile(space: Space) {
    return space.tile !== undefined && !isHazardTileType(space.tile.tileType);
  }

  // This is static because it's shared with Tourist.
  public static getAdjacentEmptySpacesCount(player: IPlayer): number {
    const board = player.game.board;
    return board.spaces.filter((space) => {
      if (space.spaceType === SpaceType.COLONY) {
        return false;
      }
      if (this.hasRealTile(space)) {
        return false;
      }
      return board.getAdjacentSpaces(space).some((adj) => {
        return this.hasRealTile(adj) && adj.player === player;
      });
    }).length;
  }
}
