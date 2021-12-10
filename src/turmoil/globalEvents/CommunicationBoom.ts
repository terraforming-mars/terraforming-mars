import {IGlobalEvent, GlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Turmoil} from '../Turmoil';
import {Resources} from '../../Resources';
import {ResourceType} from '../../ResourceType';
import {AddResourcesToCards} from '../../deferredActions/AddResourcesToCards';
import {CardRenderer} from '../../cards/render/CardRenderer';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.megacredits(-10).nbsp.data({amount: 2}).asterix().br;
  b.data().slash().influence();
});

export class CommunicationBoom extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.COMMUNICATION_BOOM,
      description: 'Pay 10MC. Add 2 data to EVERY data card. Add 1 data to any data card for each influence you have.',
      revealedDelegate: PartyName.UNITY,
      currentDelegate: PartyName.SCIENTISTS,
      renderData: RENDER_DATA,
    });
  }

  public resolve(game: Game, turmoil: Turmoil) {
    game.getPlayers().forEach((player) => {
      player.deductResource(Resources.MEGACREDITS, 10, {log: true, from: this.name});
      player.getResourceCards(ResourceType.DATA).forEach((card) => {
        player.addResourceTo(card, {qty: 2, log: true});
      });
      const count = turmoil.getPlayerInfluence(player);
      game.defer(new AddResourcesToCards(player, ResourceType.DATA, count));
    });
  }
}
