import { IGlobalEvent } from './IGlobalEvent';
import { GlobalEventName } from './GlobalEventName';
import { PartyName } from '../parties/PartyName';
import { Game } from '../../Game';
import { Resources } from '../../Resources';
import { Turmoil } from '../Turmoil';

export class SucessfulOrganisms implements IGlobalEvent {
    public name = GlobalEventName.SUCESSFUL_ORGANISMS;
    public description = "Gain 1 plant per plant production (max 5) and influence.";
    public revealedDelegate = PartyName.MARS;
    public currentDelegate = PartyName.SCIENTISTS;
    public resolve(game: Game, turmoil: Turmoil) {
        game.getPlayers().forEach(player => {
            player.setResource(Resources.PLANTS, Math.min(5, player.getProduction(Resources.PLANTS)) + turmoil.getPlayerInfluence(player), game, undefined, true);
        });    
    }
}    