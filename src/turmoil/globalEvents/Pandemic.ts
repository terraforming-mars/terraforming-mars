import { IGlobalEvent } from './IGlobalEvent';
import { GlobalEventName } from './GlobalEventName';
import { PartyName } from '../parties/PartyName';
import { Game } from '../../Game';
import { Resources } from '../../Resources';
import { Tags } from '../../cards/Tags';
import { Turmoil } from '../Turmoil';

export class Pandemic implements IGlobalEvent {
    public name = GlobalEventName.PANDEMIC;
    public description = "Lose 3 MC for each Building tag (max 5, then reduced by influence).";
    public revealedDelegate = PartyName.GREENS;
    public currentDelegate = PartyName.MARS;
    public resolve(game: Game, turmoil: Turmoil) {
        game.getPlayers().forEach(player => {
            let maxedSteelTags = Math.min(5, player.getTagCount(Tags.STEEL, false, false));
            player.setResource(Resources.MEGACREDITS, -3 * Math.max(0, maxedSteelTags - turmoil.getPlayerInfluence(player)), game, undefined, true);
        });    
    }
}    