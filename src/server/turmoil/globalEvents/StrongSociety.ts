import {IGlobalEvent} from '@/server/turmoil/globalEvents/IGlobalEvent';
import {GlobalEvent} from '@/server/turmoil/globalEvents/GlobalEvent';
import {GlobalEventName} from '@/common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '@/common/turmoil/PartyName';
import {IGame} from '@/server/IGame';
import {Resource} from '@/common/Resource';
import {Turmoil} from '@/server/turmoil/Turmoil';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {Size} from '@/common/cards/render/Size';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.megacredits(2).slash().city().influence({size: Size.SMALL});
});

export class StrongSociety extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.STRONG_SOCIETY,
      description: 'Gain 2 M€ for each city tile (max 5) and influence.',
      revealedDelegate: PartyName.REDS,
      currentDelegate: PartyName.MARS,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: IGame, turmoil: Turmoil) {
    game.playersInGenerationOrder.forEach((player) => {
      const amount = Math.min(5, player.game.board.getCities(player).length) + turmoil.getInfluence(player);
      if (amount > 0) {
        player.stock.add(Resource.MEGACREDITS, amount * 2, {log: true, from: {globalEvent: this}});
      }
    });
  }
}
