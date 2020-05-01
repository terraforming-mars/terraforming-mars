import { IGlobalEvent } from './IGlobalEvent';
import { GlobalEventName } from './GlobalEventName';
import { PartyName } from '../parties/PartyName';
import { Game } from '../../Game';
import { Turmoil } from '../Turmoil';

export class SnowCover implements IGlobalEvent {
    public name = GlobalEventName.SPONSORED_PROJECTS;
    public description = "Decrease temperature 2 steps. Draw 1 card per influence.";
    public revealedDelegate = PartyName.KELVINISTS;
    public currentDelegate = PartyName.KELVINISTS;
    public resolve(game: Game, turmoil: Turmoil) {
        game.increaseTemperature(game.getPlayers()[0], -2, false);
        game.getPlayers().forEach(player => {
            for (let i = 0, length = turmoil.getPlayerInfluence(player); i < length; i++) {
                player.cardsInHand.push(game.dealer.dealCard());
            }     
        });    
    }
}    