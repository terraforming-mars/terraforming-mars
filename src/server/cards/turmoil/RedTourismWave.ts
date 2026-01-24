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
import {SpaceType} from '../../../common/boards/SpaceType';
import {Board} from '../../boards/Board';

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
        hasExternalHelp: true,
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

  // This is static because it's shared with Tourist.
  public static getAdjacentEmptySpacesCount(player: IPlayer): number {
    const board = player.game.board;
    return board.spaces.filter((space) => {
      if (space.spaceType === SpaceType.COLONY) {
        return false;
      }
      if (space.spaceType === SpaceType.RESTRICTED) {
        return false;
      }
      if (Board.hasRealTile(space)) {
        return false;
      }
      return board.getAdjacentSpaces(space).some((adj) => {
        return Board.hasRealTile(adj) && adj.player === player;
      });
    }).length;
  }
}
