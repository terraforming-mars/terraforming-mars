import { IGlobalEvent } from './IGlobalEvent';
import { GlobalEventName } from './GlobalEventName';
import { PartyName } from '../parties/PartyName';
import { Game } from '../../Game';
import { Resources } from '../../Resources';
import { Turmoil } from '../Turmoil';

export class StrongSociety implements IGlobalEvent {
    public name = GlobalEventName.STRONG_SOCIETY;
    public description = "Gain 2 MC for each City tile (max 5) and influence.";
    public revealedDelegate = PartyName.REDS;
    public currentDelegate = PartyName.MARS;
    public resolve(game: Game, turmoil: Turmoil) {
        game.getPlayers().forEach(player => {
            const amount = Math.min(5, player.getCitiesCount(game)) + turmoil.getPlayerInfluence(player);
            if (amount > 0) {
                player.setResource(Resources.MEGACREDITS, amount * 2, game, undefined, true);
            }
        });    
    }
}    