import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Turmoil} from '../Turmoil';

export class LeadershipSummit implements IGlobalEvent {
    public name = GlobalEventName.LEADERSHIP_SUMMIT;
    public description = 'Draw 1 card for each party leader (max 5) and influence.';
    public revealedDelegate = PartyName.GREENS;
    public currentDelegate = PartyName.REDS;
    public resolve(game: Game, turmoil: Turmoil) {
      game.getPlayers().forEach((player) => {
        const partyLeaderCount = turmoil.parties.filter((party) => party.partyLeader === player.id).length;
        player.drawCard(Math.min(5, partyLeaderCount) + turmoil.getPlayerInfluence(player));
      });
    }
}
