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
  b.megacredits(2).slash().earth(1, {played}).influence({size: Size.SMALL});
});

export class HomeworldSupport extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.HOMEWORLD_SUPPORT,
      description: 'Gain 2 M€ for each Earth tag (max 5) and influence.',
      revealedDelegate: PartyName.REDS,
      currentDelegate: PartyName.UNITY,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: Game, turmoil: Turmoil) {
    game.getPlayers().forEach((player) => {
      const amount = Math.min(5, player.getTagCount(Tags.EARTH, 'raw')) + turmoil.getPlayerInfluence(player);
      if (amount > 0) {
        player.addResource(Resources.MEGACREDITS, 2 * amount, {log: true, from: this.name});
      }
    });
  }
}
