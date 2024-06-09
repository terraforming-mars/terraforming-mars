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
  b.megacredits(2).slash().tag(Tag.EARTH).influence({size: Size.SMALL});
});

export class HomeworldSupport extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.HOMEWORLD_SUPPORT,
      description: 'Gain 2 M€ for each Earth tag (max 5) and influence.',
      revealedDelegate: PartyName.REDS,
      currentDelegate: PartyName.UNITY,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: IGame, turmoil: Turmoil) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      const amount = Math.min(5, player.tags.count(Tag.EARTH, 'raw')) + turmoil.getPlayerInfluence(player);
      if (amount > 0) {
        player.stock.add(Resource.MEGACREDITS, 2 * amount, {log: true, from: this.name});
      }
    });
  }
}
