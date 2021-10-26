import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {Turmoil} from '../Turmoil';
import {Tags} from '../../cards/Tags';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../cards/render/Size';
import {played} from '../../cards/Options';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.minus().megacredits(3).slash().space({played}).influence({size: Size.SMALL});
});

export class SolarFlare implements IGlobalEvent {
    public name = GlobalEventName.SOLAR_FLARE;
    public description = 'Lose 3 M€ for each space tag (max 5, then reduced by influence).';
    public revealedDelegate = PartyName.UNITY;
    public currentDelegate = PartyName.KELVINISTS;
    public resolve(game: Game, turmoil: Turmoil) {
      game.getPlayers().forEach((player) => {
        const amount = Math.min(5, player.getTagCount(Tags.SPACE, false, false)) - turmoil.getPlayerInfluence(player);
        if (amount > 0) {
          player.addResource(Resources.MEGACREDITS, amount * -3, {log: true, from: this.name});
        }
      });
    }
    public renderData = RENDER_DATA;
}
