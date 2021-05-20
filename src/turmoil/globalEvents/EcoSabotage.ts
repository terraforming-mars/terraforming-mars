import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {Turmoil} from '../Turmoil';

export class EcoSabotage implements IGlobalEvent {
    public name = GlobalEventName.ECO_SABOTAGE;
    public description = 'Lose all plants except 3 + influence.';
    public revealedDelegate = PartyName.GREENS;
    public currentDelegate = PartyName.REDS;
    public resolve(game: Game, turmoil: Turmoil) {
      game.getPlayers().forEach((player) => {
        const plants = player.plants;
        const maxPlants = 3 + turmoil.getPlayerInfluence(player);
        const plantDecrease = Math.max(0, plants - maxPlants);
        player.deductResource(Resources.PLANTS, plantDecrease, {log: true, from: this.name});
      });
    }
}
