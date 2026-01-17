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
  b.titanium(1).slash().tag(Tag.JOVIAN).influence({size: Size.SMALL});
});

export class AsteroidMining extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.ASTEROID_MINING,
      description: 'Gain 1 titanium for each Jovian tag (max 5) and influence.',
      revealedDelegate: PartyName.REDS,
      currentDelegate: PartyName.UNITY,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: IGame, turmoil: Turmoil) {
    game.playersInGenerationOrder.forEach((player) => {
      player.stock.add(
        Resource.TITANIUM,
        Math.min(5, player.tags.count(Tag.JOVIAN, 'raw')) + turmoil.getInfluence(player),
        {log: true, from: {globalEvent: this}},
      );
    });
  }
}
