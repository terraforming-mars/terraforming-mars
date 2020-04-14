import { IGlobalEvent } from './IGlobalEvent';
import { GlobalEventName } from './GlobalEventName';
import { PartyName } from '../parties/PartyName';
import { Game } from '../../Game';
import { Resources } from '../../Resources';
import { Turmoil } from '../Turmoil';

export class Sabotage implements IGlobalEvent {
    public name = GlobalEventName.SABOTAGE;
    public revealedDelegate = PartyName.UNITY;
    public currentDelegate = PartyName.REDS;
    public resolve(game: Game, turmoil: Turmoil) {
        game.getPlayers().forEach(player => {
            player.setProduction(Resources.ENERGY, -1);
            player.setProduction(Resources.STEEL, -1);
            player.setResource(Resources.STEEL, turmoil.getPlayerInfluence(player), undefined, undefined, true);
        });    
    }
}    