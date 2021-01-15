import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Turmoil} from '../Turmoil';
import {ResourceType} from '../../ResourceType';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';

export class CloudSocieties implements IGlobalEvent {
    public name = GlobalEventName.CLOUD_SOCIETIES;
    public description = 'Add a floater to each card that can collect floaters. Add 1 floater for each influence to a card.';
    public revealedDelegate = PartyName.UNITY;
    public currentDelegate = PartyName.REDS;
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
