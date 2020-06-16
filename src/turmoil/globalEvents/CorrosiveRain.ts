import { IGlobalEvent } from './IGlobalEvent';
import { GlobalEventName } from './GlobalEventName';
import { PartyName } from '../parties/PartyName';
import { Game } from '../../Game';
import { Resources } from '../../Resources';
import { Turmoil } from '../Turmoil';
import { ResourceType } from "../../ResourceType";
import { SelectRemoveFloaters } from '../../interrupts/SelectRemoveFloaters';

export class CorrosiveRain implements IGlobalEvent {
    public name = GlobalEventName.CORROSIVE_RAIN;
    public description = "Lose 2 floaters from a card or 10 MC. Draw 1 card for each influence.";
    public revealedDelegate = PartyName.KELVINISTS;
    public currentDelegate = PartyName.GREENS;
    public resolve(game: Game, turmoil: Turmoil) {
        game.getPlayers().forEach(player => {
            for (let i = 0; i < turmoil.getPlayerInfluence(player); i++) {
                player.cardsInHand.push(game.dealer.dealCard());
            }
            let floaterCards = player.getCardsWithResources().filter(card => card.resourceType === ResourceType.FLOATER 
                && card.resourceCount != undefined 
                && card.resourceCount >= 2);
            if (floaterCards.length === 0) {
                player.setResource(Resources.MEGACREDITS, -10, game, undefined, true);
            } else {
                // Trigger interrupt
                game.addInterrupt(new SelectRemoveFloaters(player, game, floaterCards));
            }
        });    
    }
}    