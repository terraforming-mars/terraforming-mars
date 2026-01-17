import {IGlobalEvent} from '@/server/turmoil/globalEvents/IGlobalEvent';
import {GlobalEvent} from '@/server/turmoil/globalEvents/GlobalEvent';
import {GlobalEventName} from '@/common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '@/common/turmoil/PartyName';
import {IGame} from '@/server/IGame';
import {Turmoil} from '@/server/turmoil/Turmoil';
import {CardRenderer} from '@/server/cards/render/CardRenderer';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.cards(1).slash().partyLeaders(1).plus().influence();
});

export class LeadershipSummit extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.LEADERSHIP_SUMMIT,
      description: 'Draw 1 card for each party leader (max 5) and influence.',
      revealedDelegate: PartyName.GREENS,
      currentDelegate: PartyName.REDS,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: IGame, turmoil: Turmoil) {
    game.playersInGenerationOrder.forEach((player) => {
      const partyLeaderCount = turmoil.parties.filter((party) => party.partyLeader === player).length;
      player.drawCard(Math.min(5, partyLeaderCount) + turmoil.getInfluence(player));
    });
  }
}
