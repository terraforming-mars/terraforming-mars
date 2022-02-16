import {IGlobalEvent, GlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from '../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../common/turmoil/PartyName';
import {Game} from '../../Game';
import {Turmoil} from '../Turmoil';
import {Resources} from '../../common/Resources';
import {PathfindersExpansion} from '../../pathfinders/PathfindersExpansion';
import {Tags} from '../../common/cards/Tags';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../cards/render/Size';

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

  public resolve(game: Game, turmoil: Turmoil) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      const influence = turmoil.getPlayerInfluence(player);
      const deducted = Math.max(10 - influence, 0);
      player.deductResource(Resources.MEGACREDITS, deducted, {log: true, from: this.name});
    });
    PathfindersExpansion.raiseTrackForGlobalEvent(Tags.VENUS, this.name, game, 2, false);
    PathfindersExpansion.raiseTrackForGlobalEvent(Tags.EARTH, this.name, game, 2, false);
    PathfindersExpansion.raiseTrackForGlobalEvent(Tags.MARS, this.name, game, 2, false);
    PathfindersExpansion.raiseTrackForGlobalEvent(Tags.JOVIAN, this.name, game, 2, false);
    PathfindersExpansion.raiseTrackForGlobalEvent(Tags.MOON, this.name, game, 2, false);
  }
}
