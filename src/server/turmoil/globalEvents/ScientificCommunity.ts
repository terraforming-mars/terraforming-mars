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
  b.megacredits(1).slash().cards(1).influence({size: Size.SMALL});
});

export class ScientificCommunity extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.SCIENTIFIC_COMMUNITY,
      description: 'Gain 1 M€ for each card in hand (no limit) and influence.',
      revealedDelegate: PartyName.REDS,
      currentDelegate: PartyName.SCIENTISTS,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: IGame, turmoil: Turmoil) {
    game.playersInGenerationOrder.forEach((player) => {
      const amount = player.cardsInHand.length + turmoil.getInfluence(player);
      player.stock.add(Resource.MEGACREDITS, amount, {log: true, from: {globalEvent: this}});
    });
  }
}
