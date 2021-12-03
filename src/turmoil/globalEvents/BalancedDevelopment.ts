import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Turmoil} from '../Turmoil';
import {Tags} from '../../cards/Tags';
import {Resources} from '../../Resources';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {AltSecondaryTag} from '../../cards/render/CardRenderItem';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.megacredits(2).slash().mars(1, {played: true, secondaryTag: AltSecondaryTag.INFLUENCE});
});

export class BalancedDevelopment implements IGlobalEvent {
  public name = GlobalEventName.BALANCED_DEVELOPMENT;
  public description = 'Gain 2MC for each Mars tag you have (max 5) and influence.';
  public revealedDelegate = PartyName.UNITY;
  public currentDelegate = PartyName.MARS;
  public resolve(game: Game, turmoil: Turmoil) {
    game.getPlayers().forEach((player) => {
      const tags = player.getTagCount(Tags.MARS, 'raw');
      const total = Math.min(tags, 5) + turmoil.getPlayerInfluence(player);
      player.addResource(Resources.MEGACREDITS, 2 * total, {log: true, from: this.name});
    });
  }
  public renderData = RENDER_DATA;
}
