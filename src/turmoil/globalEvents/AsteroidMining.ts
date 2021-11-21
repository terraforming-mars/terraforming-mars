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
  b.titanium(1).slash().jovian({played}).influence({size: Size.SMALL});
});

export class AsteroidMining implements IGlobalEvent {
    public name = GlobalEventName.ASTEROID_MINING;
    public description = 'Gain 1 titanium for each Jovian tag (max 5) and influence.';
    public revealedDelegate = PartyName.REDS;
    public currentDelegate = PartyName.UNITY;
    public resolve(game: Game, turmoil: Turmoil) {
      game.getPlayers().forEach((player) => {
        player.addResource(Resources.TITANIUM, Math.min(5, player.getTagCount(Tags.JOVIAN, 'raw')) + turmoil.getPlayerInfluence(player), {log: true, from: this.name});
      });
    }
    public renderData = RENDER_DATA;
}
