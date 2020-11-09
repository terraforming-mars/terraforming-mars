import {ICardFactory} from './cards/ICardFactory';
import {IProjectCard} from './cards/IProjectCard';
import {CardManifest} from './cards/CardManifest';
import {COLONIES_CARD_MANIFEST} from './cards/colonies/ColoniesCardManifest';
import {PRELUDE_CARD_MANIFEST} from './cards/prelude/PreludeCardManifest';
import {PROMO_CARD_MANIFEST} from './cards/promo/PromoCardManifest';
import {BASE_CARD_MANIFEST, CORP_ERA_CARD_MANIFEST} from './cards/StandardCardManifests';
import {TURMOIL_CARD_MANIFEST} from './cards/turmoil/TurmoilCardManifest';
import {VENUS_CARD_MANIFEST} from './cards/venusNext/VenusCardManifest';
import {COMMUNITY_CARD_MANIFEST} from './cards/community/CommunityCardManifest';
import {ARES_CARD_MANIFEST} from './cards/ares/AresCardManifest';

export class CardFinder {
    private static decks: undefined | Array<CardManifest>;
    private static getDecks(): Array<CardManifest> {
      if (CardFinder.decks === undefined) {
        CardFinder.decks = [
          BASE_CARD_MANIFEST,
          CORP_ERA_CARD_MANIFEST,
          PROMO_CARD_MANIFEST,
          VENUS_CARD_MANIFEST,
          COLONIES_CARD_MANIFEST,
          PRELUDE_CARD_MANIFEST,
          TURMOIL_CARD_MANIFEST,
          ARES_CARD_MANIFEST,
          COMMUNITY_CARD_MANIFEST,
        ];
      }
      return CardFinder.decks;
    }

    // Function to return a card object by its name
    // NOTE(kberg): This replaces a larger function which searched for both Prelude cards amidst project cards
    // TODO(kberg): Find the use cases where this is used to find Prelude cards and filter them out to
    //              another function, perhaps?
    public getProjectCardByName(cardName: string): IProjectCard | undefined {
      let found : (ICardFactory<IProjectCard> | undefined);
      CardFinder.getDecks().forEach((deck) => {
        // Short circuit
        if (found !== undefined) {
          return;
        }
        found = deck.projectCards.findByCardName(cardName);
        if (found === undefined) {
          found = deck.preludeCards.findByCardName(cardName);
        }
      });
      if (found !== undefined) {
        return new found.Factory();
      }
      console.warn(`card not found ${cardName}`);
      return undefined;
    }
}
