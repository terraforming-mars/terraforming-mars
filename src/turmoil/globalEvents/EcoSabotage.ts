import { IGlobalEvent } from './IGlobalEvent';
import { GlobalEventName } from './GlobalEventName';
import { PartyName } from '../parties/PartyName';
import { Game } from '../../Game';
import { Resources } from '../../Resources';
import { Turmoil } from '../Turmoil';

export class EcoSabotage implements IGlobalEvent {
    public name = GlobalEventName.ECO_SABOTAGE;
    public description = "Lose all plants except 3 + influence.";
    public revealedDelegate = PartyName.GREENS;
    public currentDelegate = PartyName.REDS;
    public resolve(game: Game, turmoil: Turmoil) {
        game.getPlayers().forEach(player => {
            let plants = player.getResource(Resources.PLANTS);
            let maxPlants = 3 + turmoil.getPlayerInfluence(player);
            let plantDecrease = Math.max(0, plants - maxPlants);
            player.setResource(Resources.PLANTS, -plantDecrease, game, undefined, true);
        });    
    }
}   