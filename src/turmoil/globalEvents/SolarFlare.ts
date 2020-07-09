import { IGlobalEvent } from './IGlobalEvent';
import { GlobalEventName } from './GlobalEventName';
import { PartyName } from '../parties/PartyName';
import { Game } from '../../Game';
import { Resources } from '../../Resources';
import { Turmoil } from '../Turmoil';
import { Tags } from '../../cards/Tags';

export class SolarFlare implements IGlobalEvent {
    public name = GlobalEventName.SOLAR_FLARE;
    public description = "Lose 3 MC for each space tag (max 5, then reduced by influence).";
    public revealedDelegate = PartyName.UNITY;
    public currentDelegate = PartyName.KELVINISTS;
    public resolve(game: Game, turmoil: Turmoil) {
        game.getPlayers().forEach(player => {
            const amount = Math.min(5, player.getTagCount(Tags.SPACE, false, false)) - turmoil.getPlayerInfluence(player);
            if (amount > 0) {
                player.setResource(Resources.MEGACREDITS, amount * -3, game, undefined, true);
            }
        });    
    }
}    