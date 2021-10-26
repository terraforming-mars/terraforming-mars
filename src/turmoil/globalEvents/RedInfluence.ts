import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {Turmoil} from '../Turmoil';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {digit} from '../../cards/Options';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.megacredits(-3).slash().tr(5, {digit, over: 10}).br.br.production((pb) => pb.megacredits(1)).slash().influence();
});


export class RedInfluence implements IGlobalEvent {
    public name = GlobalEventName.RED_INFLUENCE;
    public description = 'Lose 3 M€ for each set of 5 TR over 10 (max 5 sets). Increase M€ production 1 step per influence.';
    public revealedDelegate = PartyName.KELVINISTS;
    public currentDelegate = PartyName.REDS;
    public resolve(game: Game, turmoil: Turmoil) {
      game.getPlayers().forEach((player) => {
        const amount = Math.floor((player.getTerraformRating() - 10)/5);
        if (amount > 0) {
          player.addResource(Resources.MEGACREDITS, amount * -3, {log: true, from: this.name});
        }
        player.addProduction(Resources.MEGACREDITS, turmoil.getPlayerInfluence(player), {log: true, from: this.name});
      });
    }
    public renderData = RENDER_DATA;
}
