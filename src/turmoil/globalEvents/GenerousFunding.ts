import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {Turmoil} from '../Turmoil';

export class GenerousFunding implements IGlobalEvent {
    public name = GlobalEventName.GENEROUS_FUNDING;
    public description = 'Gain 2 M€ for each influence and set of 5 TR over 15 (max 5 sets).';
    public revealedDelegate = PartyName.KELVINISTS;
    public currentDelegate = PartyName.UNITY;
    public resolve(game: Game, turmoil: Turmoil) {
      game.getPlayers().forEach((player) => {
        const trSets = Math.max(0, Math.floor((player.getTerraformRating() - 15) / 5));
        const maxTRSets = 5;
        const totalSets = Math.min(maxTRSets, trSets) + turmoil.getPlayerInfluence(player);
        player.addResource(Resources.MEGACREDITS, 2 * totalSets, {log: true, from: this.name});
      });
    }
}
