import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Turmoil} from '../Turmoil';
import {Resources} from '../../Resources';
import {ResourceType} from '../../ResourceType';
import {AddResourcesToCards} from '../../deferredActions/AddResourcesToCards';
import {CardRenderer} from '../../cards/render/CardRenderer';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.minus().megacredits(10).br;
  b.data().data().asterix().br;
  b.data().slash().influence();
});

export class CommunicationBoom implements IGlobalEvent {
  public name = GlobalEventName.COMMUNICATION_BOOM;
  public description = 'Pay 10MC. Add 2 data to EVERY data card. Add 1 data to any data card for each influence you have.';
  public revealedDelegate = PartyName.UNITY;
  public currentDelegate = PartyName.SCIENTISTS;
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
  public renderData = RENDER_DATA;
}
