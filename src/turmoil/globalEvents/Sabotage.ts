import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {Turmoil} from '../Turmoil';

export class Sabotage implements IGlobalEvent {
    public name = GlobalEventName.SABOTAGE;
    public description = 'Decrease steel and energy production 1 step each. Gain 1 steel per influence.';
    public revealedDelegate = PartyName.UNITY;
    public currentDelegate = PartyName.REDS;
    public resolve(game: Game, turmoil: Turmoil) {
      game.getPlayers().forEach((player) => {
        // This conditional isn't to prevent negative production, but to prevent misleading logging when the production diff is zero.
        if (player.getProduction(Resources.ENERGY) >= 1) {
          player.addProduction(Resources.ENERGY, -1, {log: true, from: this.name});
        }
        if (player.getProduction(Resources.STEEL) >= 1) {
          player.addProduction(Resources.STEEL, -1, {log: true, from: this.name});
        }
        player.addResource(Resources.STEEL, turmoil.getPlayerInfluence(player), {log: true, from: this.name});
      });
    }
}
