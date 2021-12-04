import {IGlobalEvent, GlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {Turmoil} from '../Turmoil';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../cards/render/Size';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.text('9').diverseTag(1).influence({size: Size.SMALL}).colon().megacredits(10);
});

export class Diversity extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.DIVERSITY,
      description: 'Gain 10 M€ if you have 9 or more different tags. Influence counts as unique tags.',
      revealedDelegate: PartyName.SCIENTISTS,
      currentDelegate: PartyName.SCIENTISTS,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: Game, turmoil: Turmoil) {
    game.getPlayers().forEach((player) => {
      if (player.getDistinctTagCount(false) + turmoil.getPlayerInfluence(player) >= 9) {
        player.addResource(Resources.MEGACREDITS, 10, {log: true, from: this.name});
      }
    });
  }
}
