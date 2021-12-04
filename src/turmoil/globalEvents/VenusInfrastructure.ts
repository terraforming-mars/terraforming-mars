import {IGlobalEvent, GlobalEvent} from './IGlobalEvent';
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
  b.megacredits(2).slash().venus(1, {played}).influence({size: Size.SMALL});
});

export class VenusInfrastructure extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.VENUS_INFRASTRUCTURE,
      description: 'Gain 2 M€ per Venus tag (max 5) and influence.',
      revealedDelegate: PartyName.MARS,
      currentDelegate: PartyName.UNITY,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: Game, turmoil: Turmoil) {
    game.getPlayers().forEach((player) => {
      const amount = Math.min(5, player.getTagCount(Tags.VENUS, 'raw')) + turmoil.getPlayerInfluence(player);
      if (amount > 0) {
        player.addResource(Resources.MEGACREDITS, amount * 2, {log: true, from: this.name});
      }
    });
  }
}
