import {IGlobalEvent} from '@/server/turmoil/globalEvents/IGlobalEvent';
import {GlobalEvent} from '@/server/turmoil/globalEvents/GlobalEvent';
import {GlobalEventName} from '@/common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '@/common/turmoil/PartyName';
import {IGame} from '@/server/IGame';
import {Turmoil} from '@/server/turmoil/Turmoil';
import {Tag} from '@/common/cards/Tag';
import {Resource} from '@/common/Resource';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {Size} from '@/common/cards/render/Size';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.minus().plants(1).slash().tag(Tag.EARTH).influence({size: Size.SMALL});
});

export class TiredEarth extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.TIRED_EARTH,
      description: 'Lose 1 plant for each Earth tag you own (max 5) then reduced by influence.',
      revealedDelegate: PartyName.KELVINISTS,
      currentDelegate: PartyName.GREENS,
      renderData: RENDER_DATA,
    });
  }

  public resolve(game: IGame, turmoil: Turmoil) {
    game.playersInGenerationOrder.forEach((player) => {
      const tags = player.tags.count(Tag.EARTH, 'raw');
      const rawTotal = Math.min(tags, 5) - turmoil.getInfluence(player);
      const total = Math.max(rawTotal, 0);
      player.stock.deduct(Resource.PLANTS, total, {log: true, from: {globalEvent: this}});
    });
  }
}
