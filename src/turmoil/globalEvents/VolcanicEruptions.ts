import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {Turmoil} from '../Turmoil';
import {CardRenderer} from '../../cards/render/CardRenderer';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.temperature(2).nbsp.production((pb)=>pb.heat(1)).slash().influence();
});

export class VolcanicEruptions implements IGlobalEvent {
    public name = GlobalEventName.VOLCANIC_ERUPTIONS;
    public description = 'Increase temperature 2 steps. Increase heat production 1 step per influence.';
    public revealedDelegate = PartyName.SCIENTISTS;
    public currentDelegate = PartyName.KELVINISTS;
    public resolve(game: Game, turmoil: Turmoil) {
      game.increaseTemperature(game.getPlayers()[0], 2);
      game.getPlayers().forEach((player) => {
        const amount = turmoil.getPlayerInfluence(player);
        if (amount > 0) {
          player.addProduction(Resources.HEAT, amount, {log: true, from: this.name});
        }
      });
    }
    public renderData = RENDER_DATA;
}
