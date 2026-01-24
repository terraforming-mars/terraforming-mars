import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';
import {Resource} from '../../../common/Resource';
import {Board, isSpecialTileSpace} from '../../boards/Board';
import {IActionCard} from '../ICard';

export class RedShips extends Card implements IActionCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.RED_SHIPS,
      cost: 2,

      requirements: {oxygen: 4},

      metadata: {
        cardNumber: 'X62',
        renderData: CardRenderer.builder((b) => {
          b.action('Gain 1 M€ for each CITY AND SPECIAL TILE adjacent to an ocean.',
            (ab) => ab.empty().startAction.megacredits(1).cityorSpecialTile({all}).oceans(1));
        }),
        description: 'Requires 4% oxygen.',
      },
    });
  }

  canAct(): boolean {
    return true;
  }

  action(player: IPlayer): undefined {
    const board = player.game.board;
    const candidates = board.spaces.filter((space) => {
      return Board.isCitySpace(space) || isSpecialTileSpace(space);
    });
    const included = candidates.filter(
      (space) => board.getAdjacentSpaces(space).some((adj) => Board.isOceanSpace(adj)));

    const megacredits = included.length;
    if (megacredits === 0) {
      player.game.log('${0} gained 0 M€ from ${1} action.', (b) => b.player(player).card(this));
    }
    player.stock.add(Resource.MEGACREDITS, megacredits, {log: true});

    return undefined;
  }
}
