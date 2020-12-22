import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardFinder} from '../../CardFinder';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {TURMOIL_CARD_MANIFEST} from '../turmoil/TurmoilCardManifest';
import {SendDelegateToArea} from '../../deferredActions/SendDelegateToArea';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

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
      const drawnCard = game.dealer.deck.find((card) => turmoilCards.includes(card));

      if (drawnCard !== undefined) {
        const cardIndex = game.dealer.deck.findIndex((c) => c === drawnCard);
        game.dealer.deck.splice(cardIndex, 1);
        const card = CardFinder.getProjectCardByName(drawnCard);
        if (card === undefined) {
          throw new Error('unable to find card ' + drawnCard);
        }
        player.cardsInHand.push(card);
        game.log('${0} drew ${1}', (b) => b.player(player).card(card));
      }

      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'Y03',
      renderData: CardRenderer.builder((b) => {
        b.delegates(4).br.br;
        b.cards(1).secondaryTag('turmoil');
      }),
      description: 'Place 4 delegates. Draw a Turmoil card.',
    }
}
