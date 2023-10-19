import {IGlobalEvent} from '../../turmoil/globalEvents/IGlobalEvent';
import {GlobalEvent} from '../../turmoil/globalEvents/GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {IGame} from '../../IGame';
import {Turmoil} from '../../turmoil/Turmoil';
import {Resource} from '../../../common/Resource';
import {PathfindersExpansion} from '../../pathfinders/PathfindersExpansion';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.minus().megacredits(10).influence({size: Size.SMALL}).planetaryTrack().text('2');
});

export class ConstantStruggle extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.CONSTANT_STRUGGLE,
      description: 'Pay 10M€, reduced by 1M€ per influence. Raise every planetary track 2 steps. Nobody gains the "rising player" bonus.',
      revealedDelegate: PartyName.KELVINISTS,
      currentDelegate: PartyName.REDS,
      renderData: RENDER_DATA,
    });
  }

  public resolve(game: IGame, turmoil: Turmoil) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      const influence = turmoil.getPlayerInfluence(player);
      const deducted = Math.max(10 - influence, 0);
      player.stock.deduct(Resource.MEGACREDITS, deducted, {log: true, from: this.name});
      if (deducted > 0) {
        PathfindersExpansion.addToSolBank(player);
      }
    });
    PathfindersExpansion.raiseTrackForGlobalEvent(Tag.VENUS, this.name, game, 2, false);
    PathfindersExpansion.raiseTrackForGlobalEvent(Tag.EARTH, this.name, game, 2, false);
    PathfindersExpansion.raiseTrackForGlobalEvent(Tag.MARS, this.name, game, 2, false);
    PathfindersExpansion.raiseTrackForGlobalEvent(Tag.JOVIAN, this.name, game, 2, false);
    PathfindersExpansion.raiseTrackForGlobalEvent(Tag.MOON, this.name, game, 2, false);
  }
}
