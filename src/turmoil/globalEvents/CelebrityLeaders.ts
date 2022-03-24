import {IGlobalEvent, GlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from '../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../common/turmoil/PartyName';
import {Game} from '../../Game';
import {Resources} from '../../common/Resources';
import {Turmoil} from '../Turmoil';
import {CardType} from '../../common/cards/CardType';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../common/cards/render/Size';
import {played} from '../../cards/Options';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.megacredits(2).slash().event({played}).influence({size: Size.SMALL});
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

  public resolve(game: Game, turmoil: Turmoil) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      const eventsCards = player.playedCards.filter((card) => card.cardType === CardType.EVENT).length;
      player.addResource(Resources.MEGACREDITS, 2 * (Math.min(5, eventsCards) + turmoil.getPlayerInfluence(player)), {log: true, from: this.name});
    });
  }
}
