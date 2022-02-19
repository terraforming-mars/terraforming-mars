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
  b.megacredits(2).slash().space({played}).influence({size: Size.SMALL});
});

export class InterplanetaryTrade extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.INTERPLANETARY_TRADE,
      description: 'Gain 2 M€ for each space tag (max 5) and influence.',
      revealedDelegate: PartyName.UNITY,
      currentDelegate: PartyName.UNITY,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: Game, turmoil: Turmoil) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      player.addResource(Resources.MEGACREDITS, 2 * (Math.min(5, player.getTagCount(Tags.SPACE, 'raw')) + turmoil.getPlayerInfluence(player)), {log: true, from: this.name});
    });
  }
}
