import { IGlobalEvent } from './IGlobalEvent';
import { GlobalEventName } from './GlobalEventName';
import { PartyName } from '../parties/PartyName';
import { Game } from '../../Game';
import { Resources } from '../../Resources';
import { Turmoil } from '../Turmoil';

export class GenerousFunding implements IGlobalEvent {
    public name = GlobalEventName.GENEROUS_FUNDING;
    public description = "Gain 2 MC for each influence and set of 5 TR over 15 (max 5 sets).";
    public revealedDelegate = PartyName.KELVINISTS;
    public currentDelegate = PartyName.UNITY;
    public resolve(game: Game, turmoil: Turmoil) {
        game.getPlayers().forEach(player => {
            player.setResource(Resources.MEGACREDITS, 2 * (Math.min(5, Math.floor((player.getTerraformRating() - 15) / 5)) + turmoil.getPlayerInfluence(player)), game, undefined, true);
        });    
    }
}    