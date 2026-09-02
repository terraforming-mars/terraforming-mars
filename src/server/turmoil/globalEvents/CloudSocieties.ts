import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Turmoil} from '../Turmoil';
import {CardResource} from '../../../common/CardResource';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';
import {IPlayer} from '@/server/IPlayer';

export class CloudSocieties extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.CLOUD_SOCIETIES,
      description: 'Add a floater to each card that can collect floaters. Add 1 floater for each influence to a card.',
      revealedDelegate: PartyName.UNITY,
      currentDelegate: PartyName.REDS,
      renderData: CardRenderer.builder((b) => {
        b.cards(1, {secondaryTag: AltSecondaryTag.FLOATER}).colon().resource(CardResource.FLOATER).nbsp;
        b.resource(CardResource.FLOATER).slash().influence();
      }),
    });
  }

  public override bespokeResolvePlayer(player: IPlayer) {
    const turmoil = Turmoil.getTurmoil(player.game);
    const resourceCards = player.getResourceCards(CardResource.FLOATER);
    resourceCards.forEach((card) => {
      player.addResourceTo(card, 1);
    });
    const amount = turmoil.getInfluence(player);
    if (amount > 0) {
      player.game.defer(new AddResourcesToCard(player, CardResource.FLOATER, {count: amount}));
    }
  }
}
