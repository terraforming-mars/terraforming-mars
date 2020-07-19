import { IGlobalEvent } from "./IGlobalEvent";
import { GlobalEventName } from "./GlobalEventName";
import { PartyName } from "../parties/PartyName";
import { Game } from "../../Game";
import { Turmoil } from "../Turmoil";

export class SponsoredProjects implements IGlobalEvent {
    public name = GlobalEventName.SPONSORED_PROJECTS;
    public description = "All cards with resources on them gain 1 resource. Draw 1 card for each influence.";
    public revealedDelegate = PartyName.SCIENTISTS;
    public currentDelegate = PartyName.GREENS;
    public resolve(game: Game, turmoil: Turmoil) {
        game.getPlayers().forEach(player => {
            player.getCardsWithResources().forEach(card => card.resourceCount && player.addResourceTo(card));
            for (let i = 0, length = turmoil.getPlayerInfluence(player); i < length; i++) {
                player.cardsInHand.push(game.dealer.dealCard());
            }     
        });    
    }
}    