// ============================================================
// Weather Control - B08
// Event: Get 2 M€ for each tile you own on Mars. Others get 1 M€ per their tiles.
// ============================================================
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {all} from '../Options';
import {Size} from '../../../common/cards/render/Size';

export class WeatherControl extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.WEATHER_CONTROL,
      tags: [Tag.SPACE],
      cost: 6,

      metadata: {
        cardNumber: 'B08',
        description: 'Get 2 M€ for each tile you own on Mars. Other players get 1 M€ for each tile they own on Mars.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(2).slash().text('tile').br;
          b.text('Others:').nbsp.megacredits(1).slash().text('tile', Size.SMALL, false, all);
        }),
      },
    });
  }

  public override play(player: IPlayer) {
    const board = player.game.board;

    // Count tiles for current player
    const ownTiles = board.spaces.filter((s) => s.player === player && s.tile !== undefined).length;
    player.stock.add(Resource.MEGACREDITS, ownTiles * 2, {log: true});

    // Count tiles for other players
    for (const other of player.game.players) {
      if (other === player) continue;
      const otherTiles = board.spaces.filter((s) => s.player === other && s.tile !== undefined).length;
      if (otherTiles > 0) {
        other.stock.add(Resource.MEGACREDITS, otherTiles, {log: true});
      }
    }

    return undefined;
  }
}
