import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {TURMOIL_CARD_MANIFEST} from '../turmoil/TurmoilCardManifest';
import {SendDelegateToArea} from '../../deferredActions/SendDelegateToArea';
import {CardRenderer} from '../render/CardRenderer';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';
import {CardManifest} from '../ModuleManifest';

export class PoliticalUprising extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.POLITICAL_UPRISING,

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

  public override bespokePlay(player: Player) {
    this.drawTurmoilCard(player);

    for (let i = 0; i < 4; i++) {
      player.game.defer(new SendDelegateToArea(player, 'Select where to send delegate', {source: 'reserve'}));
    }

    return undefined;
  }

  // TODO(kberg): it is possible, though unlikely, that the draw deck won't have another Turmoil card, but this
  // app ought to check the discard pile, or something.
  private drawTurmoilCard(player: Player) {
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
