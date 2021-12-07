import {IGlobalEvent, GlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {Turmoil} from '../Turmoil';
import {CardType} from '../../cards/CardType';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../cards/render/Size';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.minus().megacredits(3).slash().text('blue').cards(1).influence({size: Size.SMALL});
});

export class SolarnetShutdown extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.SOLARNET_SHUTDOWN,
      description: 'Lose 3 M€ for each blue card (max 5, then reduced by influence).',
      revealedDelegate: PartyName.SCIENTISTS,
      currentDelegate: PartyName.MARS,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: Game, turmoil: Turmoil) {
    game.getPlayers().forEach((player) => {
      const amount = Math.min(5, player.playedCards.filter((card) => card.cardType === CardType.ACTIVE).length) - turmoil.getPlayerInfluence(player);
      if (amount > 0) {
        player.addResource(Resources.MEGACREDITS, amount * -3, {log: true, from: this.name});
      }
    });
  }
}
