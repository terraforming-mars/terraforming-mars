import { IGlobalEvent } from './IGlobalEvent';
import { GlobalEventName } from './GlobalEventName';
import { PartyName } from '../parties/PartyName';
import { Game } from '../../Game';
import { Resources } from '../../Resources';
import { Turmoil } from '../Turmoil';
import { CardType } from '../../cards/CardType';

export class SolarnetShutdown implements IGlobalEvent {
    public name = GlobalEventName.SOLARNET_SHUTDOWN;
    public description = "Lose 3 MC for each blue card (max 5, then reduced by influence).";
    public revealedDelegate = PartyName.SCIENTISTS;
    public currentDelegate = PartyName.MARS;
    public resolve(game: Game, turmoil: Turmoil) {
        game.getPlayers().forEach(player => {
            const amount = Math.min(5, player.playedCards.filter((card) => card.cardType === CardType.ACTIVE).length) - turmoil.getPlayerInfluence(player);
            if (amount > 0) {
                player.setResource(Resources.MEGACREDITS, amount * -3, game, undefined, true);
            }
        });    
    }
}    