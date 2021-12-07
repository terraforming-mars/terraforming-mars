import {IGlobalEvent, GlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {Turmoil} from '../Turmoil';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../cards/render/Size';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.megacredits(2).slash().city().influence({size: Size.SMALL});
});

export class StrongSociety extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.STRONG_SOCIETY,
      description: 'Gain 2 M€ for each City tile (max 5) and influence.',
      revealedDelegate: PartyName.REDS,
      currentDelegate: PartyName.MARS,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: Game, turmoil: Turmoil) {
    game.getPlayers().forEach((player) => {
      const amount = Math.min(5, player.getCitiesCount()) + turmoil.getPlayerInfluence(player);
      if (amount > 0) {
        player.addResource(Resources.MEGACREDITS, amount * 2, {log: true, from: this.name});
      }
    });
  }
}
