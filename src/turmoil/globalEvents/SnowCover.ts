import { IGlobalEvent } from './IGlobalEvent';
import { GlobalEventName } from './GlobalEventName';
import { PartyName } from '../parties/PartyName';
import { Game } from '../../Game';
import { Turmoil } from '../Turmoil';

export class SnowCover implements IGlobalEvent {
    public name = GlobalEventName.SPONSORED_PROJECTS;
    public revealedDelegate = PartyName.KELVINISTS;
    public currentDelegate = PartyName.KELVINISTS;
    public resolve(game: Game, turmoil: Turmoil) {
        game.increaseTemperature(game.getPlayers()[0], -2, false);
        game.getPlayers().forEach(player => {
            for (let i = 0; i < turmoil.getPlayerInfluence(player); i++) {
                player.cardsInHand.push(game.dealer.dealCard());
              }
            
        });    
    }
}    