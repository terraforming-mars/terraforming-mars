import {IGlobalEvent} from './IGlobalEvent';
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

export class Riots implements IGlobalEvent {
    public name = GlobalEventName.RIOTS;
    public description = 'Lose 4 M€ for each City tile (max 5, then reduced by influence).';
    public revealedDelegate = PartyName.MARS;
    public currentDelegate = PartyName.REDS;
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
    public renderData = RENDER_DATA;
}
