
import { IGlobalEvent } from './IGlobalEvent';
import { GlobalEventName } from './GlobalEventName';
import { PartyName } from '../parties/PartyName';
import { Game } from '../../Game';
import { Resources } from '../../Resources';
import { Tags } from '../../cards/Tags';
import { Turmoil } from '../Turmoil';

export class SpinoffProducts implements IGlobalEvent {
    public name = GlobalEventName.SPINOFF_PRODUCTS;
    public description = "Gain 2 MC for each Science tag (max 5) and influence.";
    public revealedDelegate = PartyName.GREENS;
    public currentDelegate = PartyName.SCIENTISTS;
    public resolve(game: Game, turmoil: Turmoil) {
        game.getPlayers().forEach(player => {
            player.setResource(Resources.MEGACREDITS, 2 * (Math.min(5, player.getTagCount(Tags.SCIENCE, false, false)) + turmoil.getPlayerInfluence(player)), game, undefined, true);
        });    
    }
}    