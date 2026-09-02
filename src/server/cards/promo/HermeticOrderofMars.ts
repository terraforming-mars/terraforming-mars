import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {max} from '../Options';
import {IPlayer} from '../../IPlayer';
import {SpaceType} from '../../../common/boards/SpaceType';
import {Resource} from '../../../common/Resource';
import {Board} from '../../boards/Board';

export class HermeticOrderOfMars extends Card implements IProjectCard {
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
        cardNumber: 'X56',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(2)).nbsp.megacredits(1).slash().emptyTile().asterix();
        }),
        description: 'Oxygen must be 4% or lower. Increase your M€ production 2 steps. Gain 1 M€ per empty area adjacent to your tiles.',
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    const board = player.game.board;
    const spaces = board.spaces.filter((space) => {
      if (space.spaceType === SpaceType.COLONY || space.spaceType === SpaceType.RESTRICTED ||Board.hasRealTile(space)) {
        return false;
      }
      return board.getAdjacentSpaces(space).some((s) => s.player === player &&Board.hasRealTile(s));
    }).length;

    player.stock.add(Resource.MEGACREDITS, spaces, {log: true});
    return undefined;
  }
}
