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

  private drawTurmoilCard(player: IPlayer) {
    // Rather than draw and discard potentially dozens of cards, find one card in the deck that's a Turmoil card.

    // First get all the card names for Turmoil Project cards by indexing the manifest.
    const turmoilCardNames = CardManifest.keys(TURMOIL_CARD_MANIFEST.projectCards);

    const projectDeck = player.game.projectDeck;
    // Then find the first card in the deck that matches one of those names.
    let drawnCard = projectDeck.drawPile.find((card) => turmoilCardNames.includes(card.name));

    // If there's none in the draw pile, reshuffle the deck and look through the discard pile.
    if (drawnCard === undefined) {
      player.game.log(`The project deck has no Turmoil cards, so the discard pile is being reshuffled to form a new deck.`);
      projectDeck.shuffle();
      drawnCard = projectDeck.drawPile.find((card) => turmoilCardNames.includes(card.name));
    }

    if (drawnCard === undefined) {
      player.game.log('${0} played ${1} to find a Turmoil card but none were in the draw deck.', (b) => b.player(player).card(this));
    } else {
      const cardIndex = projectDeck.drawPile.findIndex((c) => c.name === drawnCard.name);
      projectDeck.drawPile.splice(cardIndex, 1);

      player.cardsInHand.push(drawnCard);
      player.game.log('${0} drew ${1}', (b) => b.player(player).card(drawnCard));
    }

    return undefined;
  }
}
