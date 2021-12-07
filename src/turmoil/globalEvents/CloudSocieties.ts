import {IGlobalEvent, GlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Turmoil} from '../Turmoil';
import {ResourceType} from '../../ResourceType';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {AltSecondaryTag} from '../../cards/render/CardRenderItem';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.cards(1, {secondaryTag: AltSecondaryTag.FLOATER}).colon().floaters(1).br.floaters(1).slash().influence();
});

export class CloudSocieties extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.CLOUD_SOCIETIES,
      description: 'Add a floater to each card that can collect floaters. Add 1 floater for each influence to a card.',
      revealedDelegate: PartyName.UNITY,
      currentDelegate: PartyName.REDS,
      renderData: RENDER_DATA,
    });
  }

  public resolve(game: Game, turmoil: Turmoil) {
    game.getPlayers().forEach((player) => {
      const resourceCards = player.getResourceCards(ResourceType.FLOATER);
      resourceCards.forEach((card) => {
        player.addResourceTo(card, 1);
      });
      const amount = turmoil.getPlayerInfluence(player);
      if (amount > 0) {
        game.defer(new AddResourcesToCard(player, ResourceType.FLOATER, {count: amount}));
      }
    });
  }
}
