import {IGlobalEvent, GlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {Turmoil} from '../Turmoil';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../cards/render/Size';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.megacredits(-3).slash().colonies(1).influence({size: Size.SMALL});
});

export class MicrogravityHealthProblems extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.MICROGRAVITY_HEALTH_PROBLEMS,
      description: 'Lose 3 M€ for each colony (max 5, then reduced by influence).',
      revealedDelegate: PartyName.MARS,
      currentDelegate: PartyName.SCIENTISTS,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: Game, turmoil: Turmoil) {
    game.getPlayers().forEach((player) => {
      let coloniesCount: number = 0;
      game.colonies.forEach((colony) => {
        coloniesCount += colony.colonies.filter((owner) => owner === player.id).length;
      });
      player.deductResource(Resources.MEGACREDITS, 3 * Math.max(0, Math.min(5, coloniesCount) - turmoil.getPlayerInfluence(player)), {log: true, from: this.name});
    });
  }
}
