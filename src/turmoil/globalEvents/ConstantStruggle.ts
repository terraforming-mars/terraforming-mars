import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Turmoil} from '../Turmoil';
import {Resources} from '../../Resources';
import {PathfindersExpansion} from '../../pathfinders/PathfindersExpansion';
import {Tags} from '../../cards/Tags';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {AltSecondaryTag} from '../../cards/render/CardRenderItem';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.minus().megacredits(10, {secondaryTag: AltSecondaryTag.INFLUENCE}).br;
  b.text('planetary tracks +2');
});

export class ConstantStruggle implements IGlobalEvent {
  public name = GlobalEventName.CONSTANT_STRUGGLE;
  public description = 'Pay 10M€, reduced by 1M€ per influence. Raise every planetary track 2 steps. Nobody gains the "rising player" bonus.';
  public revealedDelegate = PartyName.KELVINISTS;
  public currentDelegate = PartyName.REDS;
  public resolve(game: Game, turmoil: Turmoil) {
    game.getPlayers().forEach((player) => {
      const influence = turmoil.getPlayerInfluence(player);
      const deducted = Math.max(10 - influence, 0);
      player.deductResource(Resources.MEGACREDITS, deducted, {log: true, from: this.name});
    });
    PathfindersExpansion.raiseTrack2(Tags.VENUS, this.name, game, 2, false);
    PathfindersExpansion.raiseTrack2(Tags.EARTH, this.name, game, 2, false);
    PathfindersExpansion.raiseTrack2(Tags.MARS, this.name, game, 2, false);
    PathfindersExpansion.raiseTrack2(Tags.JOVIAN, this.name, game, 2, false);
    PathfindersExpansion.raiseTrack2(Tags.MOON, this.name, game, 2, false);
  }

  public renderData = RENDER_DATA;
}
