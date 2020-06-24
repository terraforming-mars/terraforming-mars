import { IGlobalEvent } from './IGlobalEvent';
import { GlobalEventName } from './GlobalEventName';
import { PartyName } from '../parties/PartyName';
import { Game } from '../../Game';
import { Resources } from '../../Resources';
import { Turmoil } from '../Turmoil';

export class Productivity implements IGlobalEvent {
    public name = GlobalEventName.PRODUCTIVITY;
    public description = "Gain 1 steel for each steel production (max 5) and influence.";
    public revealedDelegate = PartyName.SCIENTISTS;
    public currentDelegate = PartyName.MARS;
    public resolve(game: Game, turmoil: Turmoil) {
        game.getPlayers().forEach(player => {
            player.setResource(Resources.STEEL, Math.min(5, player.getProduction(Resources.STEEL)) + turmoil.getPlayerInfluence(player), game, undefined, true);
        });    
    }
}   