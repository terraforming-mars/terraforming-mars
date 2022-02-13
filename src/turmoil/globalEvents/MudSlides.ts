import {IGlobalEvent, GlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from '../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../common/turmoil/PartyName';
import {Game} from '../../Game';
import {Resources} from '../../common/Resources';
import {Turmoil} from '../Turmoil';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../cards/render/Size';
import {Board} from '../../boards/Board';

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
    game.getPlayersInGenerationOrder().forEach((player) => {
      const tiles = game.board.spaces.filter(Board.ownedBy(player))
        .filter((space) => space.tile !== undefined &&
          game.board.getAdjacentSpaces(space)
            .filter((space) => Board.isOceanSpace(space)).length > 0,
        ).length;
      const amount = Math.min(5, tiles) - turmoil.getPlayerInfluence(player);
      if (amount > 0) {
        player.deductResource(Resources.MEGACREDITS, 4 * amount, {log: true, from: this.name});
      }
    });
  }
}
