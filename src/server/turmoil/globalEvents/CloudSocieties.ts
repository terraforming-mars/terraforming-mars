import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Game} from '../../Game';
import {Turmoil} from '../Turmoil';
import {CardResource} from '../../../common/CardResource';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.br.cards(1, {secondaryTag: AltSecondaryTag.FLOATER}).colon().floaters(1).nbsp;
  b.floaters(1).slash().influence();
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
    game.getPlayersInGenerationOrder().forEach((player) => {
      const resourceCards = player.getResourceCards(CardResource.FLOATER);
      resourceCards.forEach((card) => {
        player.addResourceTo(card, 1);
      });
      const amount = turmoil.getPlayerInfluence(player);
      if (amount > 0) {
        game.defer(new AddResourcesToCard(player, CardResource.FLOATER, {count: amount}));
      }
    });
  }
}
