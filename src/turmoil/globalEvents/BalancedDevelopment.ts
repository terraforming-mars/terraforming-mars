import {GlobalEvent, IGlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Turmoil} from '../Turmoil';
import {Tags} from '../../cards/Tags';
import {Resources} from '../../Resources';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../cards/render/Size';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.megacredits(2).slash().mars(1, {played: true}).influence({size: Size.SMALL});
});

export class BalancedDevelopment extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.BALANCED_DEVELOPMENT,
      description: 'Gain 2MC for each Mars tag you have (max 5) and influence.',
      revealedDelegate: PartyName.UNITY,
      currentDelegate: PartyName.MARS,
      renderData: RENDER_DATA,
    });
  }

  public resolve(game: Game, turmoil: Turmoil) {
    game.getPlayers().forEach((player) => {
      const tags = player.getTagCount(Tags.MARS, 'raw');
      const total = Math.min(tags, 5) + turmoil.getPlayerInfluence(player);
      player.addResource(Resources.MEGACREDITS, 2 * total, {log: true, from: this.name});
    });
  }
}
