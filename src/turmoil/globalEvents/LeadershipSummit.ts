import {IGlobalEvent, GlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Turmoil} from '../Turmoil';
import {CardRenderer} from '../../cards/render/CardRenderer';

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
  public resolve(game: Game, turmoil: Turmoil) {
    game.getPlayers().forEach((player) => {
      const partyLeaderCount = turmoil.parties.filter((party) => party.partyLeader === player.id).length;
      player.drawCard(Math.min(5, partyLeaderCount) + turmoil.getPlayerInfluence(player));
    });
  }
}
