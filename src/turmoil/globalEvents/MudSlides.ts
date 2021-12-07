import {IGlobalEvent, GlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {Turmoil} from '../Turmoil';
import {TileType} from '../../TileType';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../cards/render/Size';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.minus().megacredits(4).slash().oceans(1).emptyTile().influence({size: Size.SMALL});
});

export class MudSlides extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.MUD_SLIDES,
      description: 'Lose 4 M€ for each tile adjacent to ocean (max 5, then reduced by influence).',
      revealedDelegate: PartyName.KELVINISTS,
      currentDelegate: PartyName.GREENS,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: Game, turmoil: Turmoil) {
    game.getPlayers().forEach((player) => {
      const tiles = game.board.spaces.filter((space) => (space.player !== undefined && space.player === player && space.tile !== undefined) &&
                               game.board.getAdjacentSpaces(space)
                                 .filter((space) => (space.tile !== undefined &&
                                           space.tile.tileType === TileType.OCEAN)).length > 0,
      ).length;
      const amount = Math.min(5, tiles) - turmoil.getPlayerInfluence(player);
      if (amount > 0) {
        player.deductResource(Resources.MEGACREDITS, 4 * amount, {log: true, from: this.name});
      }
    });
  }
}
