
import {IGlobalEvent, GlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {Tags} from '../../cards/Tags';
import {Turmoil} from '../Turmoil';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../cards/render/Size';
import {played} from '../../cards/Options';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.megacredits(2).slash().science(1, {played}).influence({size: Size.SMALL});
});

export class SpinoffProducts extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.SPINOFF_PRODUCTS,
      description: 'Gain 2 M€ for each Science tag (max 5) and influence.',
      revealedDelegate: PartyName.GREENS,
      currentDelegate: PartyName.SCIENTISTS,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: Game, turmoil: Turmoil) {
    game.getPlayers().forEach((player) => {
      player.addResource(Resources.MEGACREDITS, 2 * (Math.min(5, player.getTagCount(Tags.SCIENCE, 'raw')) + turmoil.getPlayerInfluence(player)), {log: true, from: this.name});
    });
  }
}
