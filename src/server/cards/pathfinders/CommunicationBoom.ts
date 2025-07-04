import {IGlobalEvent} from '../../turmoil/globalEvents/IGlobalEvent';
import {GlobalEvent} from '../../turmoil/globalEvents/GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {IGame} from '../../IGame';
import {Turmoil} from '../../turmoil/Turmoil';
import {Resource} from '../../../common/Resource';
import {CardResource} from '../../../common/CardResource';
import {AddResourcesToCards} from '../../deferredActions/AddResourcesToCards';
import {CardRenderer} from '../render/CardRenderer';
import {PathfindersExpansion} from '../../pathfinders/PathfindersExpansion';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.megacredits(-10).nbsp.resource(CardResource.DATA, 2).asterix().nbsp;
  b.resource(CardResource.DATA).slash().influence();
});

export class CommunicationBoom extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.COMMUNICATION_BOOM,
      description: 'Pay 10M€. Add 2 data to EVERY data card. Add 1 data to any data card for each influence you have.',
      revealedDelegate: PartyName.UNITY,
      currentDelegate: PartyName.SCIENTISTS,
      renderData: RENDER_DATA,
    });
  }

  public resolve(game: IGame, turmoil: Turmoil) {
    game.playersInGenerationOrder.forEach((player) => {
      const deducted = Math.min(10, player.megaCredits);
      if (deducted > 0) {
        player.stock.deduct(Resource.MEGACREDITS, 10, {log: true, from: {globalEvent: this}});
        PathfindersExpansion.addToSolBank(player);
      }
      player.getResourceCards(CardResource.DATA).forEach((card) => {
        player.addResourceTo(card, {qty: 2, log: true});
      });
      const count = turmoil.getInfluence(player);
      game.defer(new AddResourcesToCards(player, CardResource.DATA, count));
    });
  }
}
