import { IGlobalEvent } from './IGlobalEvent';
import { GlobalEventName } from './GlobalEventName';
import { PartyName } from '../parties/PartyName';
import { Game } from '../../Game';
import { Resources } from '../../Resources';
import { Turmoil } from '../Turmoil';
import { Tags } from '../../cards/Tags';

export class VenusInfrastructure implements IGlobalEvent {
    public name = GlobalEventName.VENUS_INFRASTRUCTURE;
    public description = "Gain 2 MC per Venus tag (max 5) and influence.";
    public revealedDelegate = PartyName.MARS;
    public currentDelegate = PartyName.UNITY;
    public resolve(game: Game, turmoil: Turmoil) {
        game.getPlayers().forEach(player => {
            const amount = Math.min(5, player.getTagCount(Tags.VENUS, false, false)) + turmoil.getPlayerInfluence(player);
            if (amount > 0) {
                player.setResource(Resources.MEGACREDITS, amount * 2, game, undefined, true);
            }
        });    
    }
}    