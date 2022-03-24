import {IGlobalEvent, GlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from '../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../common/turmoil/PartyName';
import {Game} from '../../Game';
import {Resources} from '../../common/Resources';
import {Tags} from '../../common/cards/Tags';
import {Turmoil} from '../Turmoil';

import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../common/cards/render/Size';
import {played} from '../../cards/Options';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.titanium(1).slash().jovian({played}).influence({size: Size.SMALL});
});

export class AsteroidMining extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.ASTEROID_MINING,
      description: 'Gain 1 titanium for each Jovian tag (max 5) and influence.',
      revealedDelegate: PartyName.REDS,
      currentDelegate: PartyName.UNITY,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: Game, turmoil: Turmoil) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      player.addResource(Resources.TITANIUM, Math.min(5, player.getTagCount(Tags.JOVIAN, 'raw')) + turmoil.getPlayerInfluence(player), {log: true, from: this.name});
    });
  }
}
