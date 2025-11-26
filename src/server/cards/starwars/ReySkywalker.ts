import {Card} from '@/server/cards/Card';
import {CardType} from '@/common/cards/CardType';
import {IProjectCard} from '@/server/cards/IProjectCard';
import {Tag} from '@/common/cards/Tag';
import {Player} from '@/server/Player';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {SelectSpace} from '@/server/inputs/SelectSpace';
import {TileType} from '@/common/TileType';
import {message} from '@/server/logs/MessageBuilder';
import {CardResource} from '@/common/CardResource';
import {AresHandler} from '@/server/ares/AresHandler';

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
          b.emptyTile().resource(CardResource.RESOURCE_CUBE).asterix();
        }),
        description: 'Raise your M€ production 4 steps. Place a bronze cube on an empty unreserved space on Mars. No tile or token may be placed on that space for the rest of the game.',
      },
    });
  }

  public override bespokePlay(player: Player) {
    return new SelectSpace(
      message('Select space for ${0}', (b) => b.card(this)),
      player.game.board.getAvailableSpacesOnLand(player).filter((space) => !AresHandler.hasHazardTile(space)))
      .andThen((space) => {
        player.game.simpleAddTile(player, space, {tileType: TileType.REY_SKYWALKER});
        return undefined;
      });
  }
}
