import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Turmoil} from '../Turmoil';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../cards/render/Size';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.minus().text('4').tr(1).influence({size: Size.SMALL});
});

export class WarOnEarth implements IGlobalEvent {
    public name = GlobalEventName.WAR_ON_EARTH;
    public description = 'Reduce TR 4 steps. Each influence prevents 1 step.';
    public revealedDelegate = PartyName.MARS;
    public currentDelegate = PartyName.KELVINISTS;
    public resolve(game: Game, turmoil: Turmoil) {
      game.getPlayers().forEach((player) => {
        player.decreaseTerraformRatingSteps(4 - turmoil.getPlayerInfluence(player));
      });
    }
    public renderData = RENDER_DATA;
}
