import {IGlobalEvent} from '../../turmoil/globalEvents/IGlobalEvent';
import {GlobalEvent} from '../../turmoil/globalEvents/GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {IGame} from '../../IGame';
import {Turmoil} from '../../turmoil/Turmoil';
import {Resource} from '../../../common/Resource';
import {IPlayer} from '../../IPlayer';
import {isSpecialTileSpace, Board} from '../../boards/Board';
import {CardRenderer} from '../render/CardRenderer';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.production((pb) => pb.megacredits(1)).slash().specialTile().nbsp;
  b.energy(1).slash().influence();
});

export class SpaceRaceToMars extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.SPACE_RACE_TO_MARS,
      description: 'Increase your M€ production 1 step for every special tile you own (max 5.) Gain 1 energy for every influence you have',
      revealedDelegate: PartyName.SCIENTISTS,
      currentDelegate: PartyName.MARS,
      renderData: RENDER_DATA,
    });
  }

  public resolve(game: IGame, turmoil: Turmoil) {
    game.playersInGenerationOrder.forEach((player) => {
      const specialTileCount = this.specialTileCount(player);
      const bonus = Math.min(specialTileCount, 5);
      player.production.add(Resource.MEGACREDITS, bonus, {log: true, from: {globalEvent: this}});
      player.stock.add(Resource.ENERGY, turmoil.getInfluence(player), {log: true, from: {globalEvent: this}});
    });
  }

  private specialTileCount(player: IPlayer) {
    const marsSpaces = player.game.board.spaces;
    const marsCount = marsSpaces.filter(Board.ownedBy(player))
      .filter(isSpecialTileSpace).length;

    const moonSpaces = player.game.moonData?.moon.spaces ?? [];
    const moonCount = moonSpaces
      // TODO(kberg): include co-owner.
      .filter(Board.ownedBy(player))
      .filter(isSpecialTileSpace)
      .length;

    return marsCount + moonCount;
  }
}
