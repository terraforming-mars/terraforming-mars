import {IGlobalEvent} from '@/server/turmoil/globalEvents/IGlobalEvent';
import {GlobalEvent} from '@/server/turmoil/globalEvents/GlobalEvent';
import {GlobalEventName} from '@/common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '@/common/turmoil/PartyName';
import {IGame} from '@/server/IGame';
import {Resource} from '@/common/Resource';
import {Turmoil} from '@/server/turmoil/Turmoil';
import {Tag} from '@/common/cards/Tag';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {Size} from '@/common/cards/render/Size';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.minus().megacredits(3).slash().tag(Tag.SPACE).influence({size: Size.SMALL});
});

export class SolarFlare extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.SOLAR_FLARE,
      description: 'Lose 3 M€ for each space tag (max 5, then reduced by influence).',
      revealedDelegate: PartyName.UNITY,
      currentDelegate: PartyName.KELVINISTS,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: IGame, turmoil: Turmoil) {
    game.playersInGenerationOrder.forEach((player) => {
      const amount = Math.min(5, player.tags.count(Tag.SPACE, 'raw')) - turmoil.getInfluence(player);
      if (amount > 0) {
        player.stock.deduct(Resource.MEGACREDITS, amount * 3, {log: true, from: {globalEvent: this}});
      }
    });
  }
}
