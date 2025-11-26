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
  b.text('Lose all').heat(1).nbsp.megacredits(-2).slash().tag(Tag.BUILDING).influence({size: Size.SMALL});
});

export class GlobalDustStorm extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.GLOBAL_DUST_STORM,
      description: 'Lose all heat. Lose 2 M€ for each building tag (max 5, then reduced by influence).',
      revealedDelegate: PartyName.KELVINISTS,
      currentDelegate: PartyName.GREENS,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: IGame, turmoil: Turmoil): void {
    game.playersInGenerationOrder.forEach((player) => {
      if (player.heat > 0) {
        player.stock.deduct(Resource.HEAT, player.heat, {log: true, from: {globalEvent: this}});
      }
      const maxedSteelTags = Math.min(5, player.tags.count(Tag.BUILDING, 'raw'));
      player.stock.deduct(
        Resource.MEGACREDITS,
        2 * Math.max(0, maxedSteelTags - turmoil.getInfluence(player)),
        {log: true, from: {globalEvent: this}},
      );
    });
  }
}
