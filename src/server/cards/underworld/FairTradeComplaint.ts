import {IGlobalEvent} from '../../turmoil/globalEvents/IGlobalEvent';
import {GlobalEvent} from '../../turmoil/globalEvents/GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {Turmoil} from '../../turmoil/Turmoil';
import {PartyName} from '../../../common/turmoil/PartyName';
import {IGame} from '../../IGame';
import {Resource} from '../../../common/Resource';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {digit} from '../../cards/Options';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.megacredits(-1).slash().cards(1, {over: 6}).influence({size: Size.SMALL}).nbsp;
  b.text('MAX 6').cards(1).colon().cards(2, {digit});
});

export class FairTradeComplaint extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.FAIR_TRADE_COMPLAINT,
      description: 'Lose 1 M€ for each card in your hand over 6 (no limit) ' +
        'reduced by 2 M€ per influence (min 0M€). ' +
        'Draw 2 cards if your hand contains 6 cards or less.',
      revealedDelegate: PartyName.KELVINISTS,
      currentDelegate: PartyName.UNITY,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: IGame, turmoil: Turmoil) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      const penalty = Math.max(0, (player.cardsInHand.length - 6));
      if (penalty === 0) {
        player.drawCard(2);
      }
      const savings = 2 * turmoil.getPlayerInfluence(player);
      const cost = Math.max(0, penalty - savings);
      if (cost > 0) {
        player.stock.deduct(Resource.MEGACREDITS, cost, {log: true, from: this.name});
      }
    });
  }
}
