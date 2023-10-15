import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {SelectSpace} from '../../inputs/SelectSpace';
import {TileType} from '../../../common/TileType';

export class ReySkywalker extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.REY_SKYWALKER,
      tags: [Tag.BUILDING],
      cost: 8,
      victoryPoints: -2,

      behavior: {
        production: {
          megacredits: 4,
        },
      },

      metadata: {
        cardNumber: 'SW09',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(4)).nbsp;
          b.emptyTile().resourceCube();
        }),
        description: 'Raise your M€ production 4 steps. Place a bronze cube on an empty unreserved space on Mars. No tile may be placed on that space for the rest of the game. (NOTE: currently using the Restricted Area tile instead of a bronze cube.)',
      },
    });
  }

  public override bespokePlay(player: Player) {
    return new SelectSpace(
      'Select an empty space to make unavailable for the rest of the game',
      player.game.board.getAvailableSpacesOnLand(player))
      .andThen((space) => {
        // TODO(kberg): Don't use Restricted Area.
        space.tile = {tileType: TileType.RESTRICTED_AREA, protectedHazard: true};
        return undefined;
      });
  }
}
