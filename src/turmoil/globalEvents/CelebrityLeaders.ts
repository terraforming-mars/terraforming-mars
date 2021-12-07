import {IGlobalEvent, GlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {Turmoil} from '../Turmoil';
import {CardType} from '../../cards/CardType';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../cards/render/Size';
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
    game.getPlayers().forEach((player) => {
      const eventsCards = player.playedCards.filter((card) => card.cardType === CardType.EVENT).length;
      player.addResource(Resources.MEGACREDITS, 2 * (Math.min(5, eventsCards) + turmoil.getPlayerInfluence(player)), {log: true, from: this.name});
    });
  }
}
