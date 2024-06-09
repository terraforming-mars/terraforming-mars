
import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {IGame} from '../../IGame';
import {Resource} from '../../../common/Resource';
import {Tag} from '../../../common/cards/Tag';
import {Turmoil} from '../Turmoil';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.megacredits(2).slash().tag(Tag.SCIENCE).influence({size: Size.SMALL});
});

export class SpinoffProducts extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.SPINOFF_PRODUCTS,
      description: 'Gain 2 M€ for each science tag (max 5) and influence.',
      revealedDelegate: PartyName.GREENS,
      currentDelegate: PartyName.SCIENTISTS,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: IGame, turmoil: Turmoil) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      player.stock.add(Resource.MEGACREDITS, 2 * (Math.min(5, player.tags.count(Tag.SCIENCE, 'raw-pf')) + turmoil.getPlayerInfluence(player)), {log: true, from: this.name});
    });
  }
}
