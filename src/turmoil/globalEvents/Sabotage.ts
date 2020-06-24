import { IGlobalEvent } from './IGlobalEvent';
import { GlobalEventName } from './GlobalEventName';
import { PartyName } from '../parties/PartyName';
import { Game } from '../../Game';
import { Resources } from '../../Resources';
import { Turmoil } from '../Turmoil';

export class Sabotage implements IGlobalEvent {
    public name = GlobalEventName.SABOTAGE;
    public description = "Decrease steel and energy production 1 step each. Gain 1 steel per influence.";
    public revealedDelegate = PartyName.UNITY;
    public currentDelegate = PartyName.REDS;
    public resolve(game: Game, turmoil: Turmoil) {
        game.getPlayers().forEach(player => {
            player.setProduction(Resources.ENERGY, -1, game, undefined, true);
            player.setProduction(Resources.STEEL, -1, game, undefined, true);
            player.setResource(Resources.STEEL, turmoil.getPlayerInfluence(player), game, undefined, true);
        });    
    }
}    