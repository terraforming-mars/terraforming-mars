import {GlobalEvent, IGlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {Turmoil} from '../Turmoil';
import {Board} from '../../boards/Board';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../cards/render/Size';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.minus().megacredits(4).slash().city().influence({size: Size.SMALL});
});

export class Riots extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.RIOTS,
      description: 'Lose 4 M€ for each City tile (max 5, then reduced by influence).',
      revealedDelegate: PartyName.MARS,
      currentDelegate: PartyName.REDS,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: Game, turmoil: Turmoil) {
    game.getPlayers().forEach((player) => {
      const city = game.board.spaces.filter(
        (space) => Board.isCitySpace(space) &&
                         space.player === player,
      ).length;
      const amount = Math.min(5, city) - turmoil.getPlayerInfluence(player);
      if (amount > 0) {
        player.deductResource(Resources.MEGACREDITS, 4 * amount, {log: true, from: this.name});
      }
    });
  }
}
