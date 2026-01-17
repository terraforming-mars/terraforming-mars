import {IGlobalEvent} from '@/server/turmoil/globalEvents/IGlobalEvent';
import {GlobalEvent} from '@/server/turmoil/globalEvents/GlobalEvent';
import {GlobalEventName} from '@/common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '@/common/turmoil/PartyName';
import {IGame} from '@/server/IGame';
import {Resource} from '@/common/Resource';
import {Turmoil} from '@/server/turmoil/Turmoil';
import {Board} from '@/server/boards/Board';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {Size} from '@/common/cards/render/Size';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.minus().megacredits(4).slash().city().influence({size: Size.SMALL});
});

export class Riots extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.RIOTS,
      description: 'Lose 4 M€ for each city tile (max 5, then reduced by influence).',
      revealedDelegate: PartyName.MARS,
      currentDelegate: PartyName.REDS,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: IGame, turmoil: Turmoil) {
    game.playersInGenerationOrder.forEach((player) => {
      const city = game.board.spaces.filter(
        (space) => Board.isCitySpace(space) &&
                         space.player === player,
      ).length;
      const amount = Math.min(5, city) - turmoil.getInfluence(player);
      if (amount > 0) {
        player.stock.deduct(Resource.MEGACREDITS, 4 * amount, {log: true, from: {globalEvent: this}});
      }
    });
  }
}
