import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {Tags} from '../../cards/Tags';
import {Turmoil} from '../Turmoil';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../cards/render/Size';
import {played} from '../../cards/Options';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.megacredits(2).slash().space({played}).influence({size: Size.SMALL});
});

export class InterplanetaryTrade implements IGlobalEvent {
    public name = GlobalEventName.INTERPLANETARY_TRADE;
    public description = 'Gain 2 M€ for each space tag (max 5) and influence.';
    public revealedDelegate = PartyName.UNITY;
    public currentDelegate = PartyName.UNITY;
    public resolve(game: Game, turmoil: Turmoil) {
      game.getPlayers().forEach((player) => {
        player.addResource(Resources.MEGACREDITS, 2 * (Math.min(5, player.getTagCount(Tags.SPACE, false, false)) + turmoil.getPlayerInfluence(player)), {log: true, from: this.name});
      });
    }
    public renderData = RENDER_DATA;
}
