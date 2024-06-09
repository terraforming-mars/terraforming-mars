import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {IGame} from '../../IGame';
import {Resource} from '../../../common/Resource';
import {Turmoil} from '../Turmoil';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {Tag} from '../../../common/cards/Tag';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.megacredits(2).slash().tag(Tag.EVENT).influence({size: Size.SMALL});
});

export class CelebrityLeaders extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.CELEBRITY_LEADERS,
      description: 'Gain 2 M€ for each event played (max 5) and influence.',
      revealedDelegate: PartyName.UNITY,
      currentDelegate: PartyName.GREENS,
      renderData: RENDER_DATA,
    });
  }

  public resolve(game: IGame, turmoil: Turmoil) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      const eventsCards = player.playedCards.filter((card) => card.type === CardType.EVENT).length;
      player.stock.add(Resource.MEGACREDITS, 2 * (Math.min(5, eventsCards) + turmoil.getPlayerInfluence(player)), {log: true, from: this.name});
    });
  }
}
