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
  b.megacredits(-3).slash().building(1, {played}).influence({size: Size.SMALL});
});

export class Pandemic extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.PANDEMIC,
      description: 'Lose 3 M€ for each Building tag (max 5, then reduced by influence).',
      revealedDelegate: PartyName.GREENS,
      currentDelegate: PartyName.MARS,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: Game, turmoil: Turmoil) {
    game.getPlayers().forEach((player) => {
      const maxedSteelTags = Math.min(5, player.getTagCount(Tags.BUILDING, 'raw'));
      player.deductResource(Resources.MEGACREDITS, 3 * Math.max(0, maxedSteelTags - turmoil.getPlayerInfluence(player)), {log: true, from: this.name});
    });
  }
}
