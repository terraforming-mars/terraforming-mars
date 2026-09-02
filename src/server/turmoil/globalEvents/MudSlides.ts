import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Resource} from '../../../common/Resource';
import {Turmoil} from '../Turmoil';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {Board} from '../../boards/Board';
import {IPlayer} from '@/server/IPlayer';

export class MudSlides extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.MUD_SLIDES,
      description: 'Lose 4 M€ for each tile adjacent to ocean (max 5, then reduced by influence).',
      revealedDelegate: PartyName.KELVINISTS,
      currentDelegate: PartyName.GREENS,
      renderData: CardRenderer.builder((b) => {
        b.minus().megacredits(4).slash().oceans(1).emptyTile().influence({size: Size.SMALL});
      }),
    });
  }
  public override bespokeResolvePlayer(player: IPlayer) {
    const turmoil = Turmoil.getTurmoil(player.game);
    const tiles = player.game.board.spaces.filter(Board.ownedBy(player))
      .filter((space) => space.tile !== undefined &&
        player.game.board.getAdjacentSpaces(space)
          .filter((space) => Board.isOceanSpace(space)).length > 0,
      ).length;
    const amount = Math.min(5, tiles) - turmoil.getInfluence(player);
    if (amount > 0) {
      player.stock.deduct(Resource.MEGACREDITS, 4 * amount, {log: true, from: {globalEvent: this}});
    }
  }
}
