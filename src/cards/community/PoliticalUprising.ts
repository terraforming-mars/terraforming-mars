import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {TURMOIL_CARD_MANIFEST} from '../turmoil/TurmoilCardManifest';
import {SendDelegateToArea} from '../../deferredActions/SendDelegateToArea';

export class PoliticalUprising extends PreludeCard implements IProjectCard {
    public tags = [];
    public name = CardName.POLITICAL_UPRISING;

    public play(player: Player, game: Game) {
      this.drawTurmoilCard(player, game);

      for (let i = 0; i < 4; i++) {
        game.defer(new SendDelegateToArea(player, game, 'Select where to send delegate', 1, undefined, undefined, false));
      }

      return undefined;
    }

    private drawTurmoilCard(player: Player, game: Game) {
      const turmoilCards = TURMOIL_CARD_MANIFEST.projectCards.cards.map((c) => c.cardName);
      const drawnCard = game.dealer.deck.find((card) => turmoilCards.includes(card.name));

      if (drawnCard) {
        const cardIndex = game.dealer.deck.findIndex((c) => c.name === drawnCard.name);
        game.dealer.deck.splice(cardIndex, 1);

        player.cardsInHand.push(drawnCard);
        game.log('${0} drew ${1}', (b) => b.player(player).card(drawnCard));
      }

      return undefined;
    }
}
