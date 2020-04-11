import { IGlobalEvent } from './IGlobalEvent';
import { GlobalEventName } from './GlobalEventName';
import { PartyName } from '../parties/PartyName';
import { Game } from '../../Game';
import { Resources } from '../../Resources';
import { Tags } from '../../cards/Tags';
import { Turmoil } from '../Turmoil';

export class GlobalDustStorm implements IGlobalEvent {
    public name = GlobalEventName.GLOBAL_DUST_STORM;
    public revealedDelegate = PartyName.KELVINISTS;
    public currentDelegate = PartyName.GREENS;
    public resolve(game: Game, turmoil: Turmoil) {
        game.getPlayers().forEach(player => {
            if (player.getResource(Resources.HEAT) > 0) {
                player.setResource(Resources.HEAT, -player.getResource(Resources.HEAT), undefined, undefined, true);
            }
            let maxedSteelTags = Math.min(5, player.getTagCount(Tags.STEEL, false, false));
            player.setResource(Resources.MEGACREDITS, -2 * Math.max(0, maxedSteelTags - turmoil.getPlayerInfluence(player)), undefined, undefined, true);
        });    
    }
}    