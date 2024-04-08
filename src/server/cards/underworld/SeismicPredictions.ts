import {IGlobalEvent} from '../../turmoil/globalEvents/IGlobalEvent';
import {GlobalEvent} from '../../turmoil/globalEvents/GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {IGame} from '../../IGame';
import {Resource} from '../../../common/Resource';
import {Turmoil} from '../../turmoil/Turmoil';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';
import {isHazardTileType} from '../../../common/AresTileType';
import {Size} from '../../../common/cards/render/Size';
import {cancelled} from '../../cards/Options';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.text('ALL').undergroundResources(1, {cancelled}).nbsp.megacredits(-2).slash().emptyTile().asterix().influence({size: Size.SMALL});
});

export class SeismicPredictions extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.SEISMIC_PREDICTIONS,
      description: 'Discard all unclaimed underground resources. ' +
      'Lose 2 M€ for each tile on Mars you own WITHOUT excavation markers (max 5) minus influence.',
      revealedDelegate: PartyName.SCIENTISTS,
      currentDelegate: PartyName.MARS,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: IGame, turmoil: Turmoil) {
    UnderworldExpansion.removeAllUnclaimedTokens(game);

    game.getPlayersInGenerationOrder().forEach((player) => {
      const playerSpaces = player.game.board.spaces.filter((space) => {
        return space.player === player && space.tile !== undefined && !isHazardTileType(space.tile?.tileType);
      });
      const filtered = playerSpaces.filter(
        (space) => space.undergroundResources === undefined && space.excavator === undefined);
      const penalty = Math.min(5, filtered.length) - turmoil.getPlayerInfluence(player);
      const cost = penalty * 2;
      if (cost > 0) {
        player.stock.deduct(Resource.MEGACREDITS, cost, {log: true, from: this.name});
      }
    });
  }
}
