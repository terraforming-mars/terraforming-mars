import {IGlobalEvent} from '@/server/turmoil/globalEvents/IGlobalEvent';
import {GlobalEvent} from '@/server/turmoil/globalEvents/GlobalEvent';
import {GlobalEventName} from '@/common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '@/common/turmoil/PartyName';
import {IGame} from '@/server/IGame';
import {Resource} from '@/common/Resource';
import {Tag} from '@/common/cards/Tag';
import {Turmoil} from '@/server/turmoil/Turmoil';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {Size} from '@/common/cards/render/Size';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.minus().titanium(1).slash().tag(Tag.JOVIAN).influence({size: Size.SMALL});
});

export class MinersOnStrike extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.MINERS_ON_STRIKE,
      description: 'Lose 1 titanium for each Jovian tag (max 5, then reduced by influence).',
      revealedDelegate: PartyName.MARS,
      currentDelegate: PartyName.GREENS,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: IGame, turmoil: Turmoil) {
    game.playersInGenerationOrder.forEach((player) => {
      const amount = Math.min(5, player.tags.count(Tag.JOVIAN, 'raw')) - turmoil.getInfluence(player);
      if (amount > 0) {
        player.stock.deduct(Resource.TITANIUM, amount, {log: true, from: {globalEvent: this}});
      }
    });
  }
}
