import { IGlobalEvent } from './IGlobalEvent';
import { GlobalEventName } from './GlobalEventName';
import { PartyName } from '../parties/PartyName';
import { Game } from '../../Game';
import { Resources } from '../../Resources';
import { Tags } from '../../cards/Tags';
import { Turmoil } from '../Turmoil';

export class InterplanetaryTrade implements IGlobalEvent {
    public name = GlobalEventName.INTERPLANETARY_TRADE;
    public description = "Gain 2 MC for each space tag (max 5) and influence.";
    public revealedDelegate = PartyName.UNITY;
    public currentDelegate = PartyName.UNITY;
    public resolve(game: Game, turmoil: Turmoil) {
        game.getPlayers().forEach(player => {
            player.setResource(Resources.MEGACREDITS, 2 * (Math.min(5, player.getTagCount(Tags.SPACE, false, false)) + turmoil.getPlayerInfluence(player)), game, undefined, true);
        });    
    }
}    