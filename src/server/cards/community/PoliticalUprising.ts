import {IPlayer} from '../../IPlayer';
import {PreludeCard} from '../prelude/PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {TURMOIL_CARD_MANIFEST} from '../turmoil/TurmoilCardManifest';
import {CardRenderer} from '../render/CardRenderer';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';
import {CardManifest} from '../ModuleManifest';

export class PoliticalUprising extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.POLITICAL_UPRISING,

      behavior: {
        turmoil: {sendDelegates: {count: 4, manyParties: true}},
      },

      metadata: {
        cardNumber: 'Y03',
        renderData: CardRenderer.builder((b) => {
          b.delegates(4).br.br;
          b.cards(1, {secondaryTag: AltSecondaryTag.TURMOIL});
        }),
        description: 'Place 4 delegates in any parties. Draw a Turmoil card.',
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    this.drawTurmoilCard(player);
    return undefined;
  }

  // TODO(kberg): it is possible, though unlikely, that the draw deck won't have another Turmoil card, but this
  // app ought to check the discard pile, or something.
  private drawTurmoilCard(player: IPlayer) {
    // Rather than draw and discard potentially dozens of cards, find one card in the deck that's a Turmoil card.

    // First get all the card names for Turmoil Project cards by indexing the manifest.
    const turmoilCardNames = CardManifest.keys(TURMOIL_CARD_MANIFEST.projectCards);

    // Then find the first card in the deck that matches one of those names.
    const drawnCard = player.game.projectDeck.drawPile.find((card) => turmoilCardNames.includes(card.name));

    if (drawnCard === undefined) {
      player.game.log('${0} played ${1} to find a Turmoil card but none were in the draw deck.', (b) => b.player(player).card(this));
    } else {
      const cardIndex = player.game.projectDeck.drawPile.findIndex((c) => c.name === drawnCard.name);
      player.game.projectDeck.drawPile.splice(cardIndex, 1);

      player.cardsInHand.push(drawnCard);
      player.game.log('${0} drew ${1}', (b) => b.player(player).card(drawnCard));
    }

    return undefined;
  }
}
