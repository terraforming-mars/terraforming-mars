import { IGlobalEvent } from './IGlobalEvent';
import { GlobalEventName } from './GlobalEventName';
import { PartyName } from '../parties/PartyName';
import { Game } from '../../Game';
import { Resources } from '../../Resources';
import { Turmoil } from '../Turmoil';
import { CardType } from "../../cards/CardType";

export class CelebrityLeaders implements IGlobalEvent {
    public name = GlobalEventName.CELEBRITY_LEADERS;
    public description = "Gain 2 MC for each event played (max 5) and influence.";
    public revealedDelegate = PartyName.UNITY;
    public currentDelegate = PartyName.GREENS;
    public resolve(game: Game, turmoil: Turmoil) {
        game.getPlayers().forEach(player => {
            let eventsCards = player.playedCards.filter(card => card.cardType === CardType.EVENT).length;
            player.setResource(Resources.MEGACREDITS, 2 * (Math.min(5, eventsCards) + turmoil.getPlayerInfluence(player)), game, undefined, true);
        });    
    }
}    