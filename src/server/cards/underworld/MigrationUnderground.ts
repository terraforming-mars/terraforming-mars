import {IGlobalEvent} from '@/server/turmoil/globalEvents/IGlobalEvent';
import {GlobalEvent} from '@/server/turmoil/globalEvents/GlobalEvent';
import {GlobalEventName} from '@/common/turmoil/globalEvents/GlobalEventName';
import {Turmoil} from '@/server/turmoil/Turmoil';
import {PartyName} from '@/common/turmoil/PartyName';
import {IGame} from '@/server/IGame';
import {Resource} from '@/common/Resource';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {digit} from '@/server/cards/Options';
import {Size} from '@/common/cards/render/Size';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.production((pb) => pb.megacredits(1)).slash().undergroundResources(2, {digit}).influence({size: Size.SMALL});
});

export class MigrationUnderground extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.MIGRATION_UNDERGROUND,
      description: 'Gain 1 M€ production (max 5) for every 2 underworld tokens you own. Each point of influence counts as an extra underworld token.',
      revealedDelegate: PartyName.REDS,
      currentDelegate: PartyName.GREENS,
      renderData: RENDER_DATA,
    });
  }

  public resolve(game: IGame, turmoil: Turmoil) {
    game.playersInGenerationOrder.forEach((player) => {
      const sum = player.underworldData.tokens.length + turmoil.getInfluence(player);
      const mc = Math.floor(sum / 2);
      const max = Math.min(mc, 5);
      player.production.add(Resource.MEGACREDITS, max, {log: true});
    });
  }
}
