import {IGlobalEvent} from '../../turmoil/globalEvents/IGlobalEvent';
import {GlobalEvent} from '../../turmoil/globalEvents/GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {IGame} from '../../IGame';
import {Turmoil} from '../../turmoil/Turmoil';
import {Tag} from '../../../common/cards/Tag';
import {Resource} from '../../../common/Resource';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.megacredits(2).slash().tag(Tag.MARS).influence({size: Size.SMALL});
});

export class BalancedDevelopment extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.BALANCED_DEVELOPMENT,
      description: 'Gain 2M€ for each Mars tag you have (max 5) and influence.',
      revealedDelegate: PartyName.UNITY,
      currentDelegate: PartyName.MARS,
      renderData: RENDER_DATA,
    });
  }

  public resolve(game: IGame, turmoil: Turmoil) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      const tags = player.tags.count(Tag.MARS, 'raw');
      const total = Math.min(tags, 5) + turmoil.getPlayerInfluence(player);
      player.stock.add(Resource.MEGACREDITS, 2 * total, {log: true, from: this.name});
    });
  }
}
