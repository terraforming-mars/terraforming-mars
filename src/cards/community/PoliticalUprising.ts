import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {TURMOIL_CARD_MANIFEST} from '../turmoil/TurmoilCardManifest';
import {SendDelegateToArea} from '../../deferredActions/SendDelegateToArea';
import {CardRenderer} from '../render/CardRenderer';
import {AltSecondaryTag} from '../render/CardRenderItem';

export class PoliticalUprising extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.POLITICAL_UPRISING,

      metadata: {
        cardNumber: 'Y03',
        renderData: CardRenderer.builder((b) => {
          b.delegates(4).br.br;
          b.cards(1).secondaryTag(AltSecondaryTag.TURMOIL);
        }),
        description: 'Place 4 delegates. Draw a Turmoil card.',
      },
    });
  }

  public play(player: Player, game: Game) {
    this.drawTurmoilCard(player, game);

    for (let i = 0; i < 4; i++) {
      game.defer(new SendDelegateToArea(player, 'Select where to send delegate', 1, undefined, undefined, false));
    }

    return undefined;
  }

  private drawTurmoilCard(player: Player, game: Game) {
    const turmoilCards: Array<CardName> = [];
    TURMOIL_CARD_MANIFEST.projectCards.factories.forEach((cf) => turmoilCards.push(cf.cardName));
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
