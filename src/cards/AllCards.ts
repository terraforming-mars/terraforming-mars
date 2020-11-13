import {Decks} from '../Deck';
import {ARES_CARD_MANIFEST} from './ares/AresCardManifest';
import {GameModule} from '../GameModule';
import {CardManifest} from './CardManifest';
import {COLONIES_CARD_MANIFEST} from './colonies/ColoniesCardManifest';
import {COMMUNITY_CARD_MANIFEST} from './community/CommunityCardManifest';
import {PRELUDE_CARD_MANIFEST} from './prelude/PreludeCardManifest';
import {PROMO_CARD_MANIFEST} from './promo/PromoCardManifest';
import {
  BASE_CARD_MANIFEST,
  CORP_ERA_CARD_MANIFEST,
} from './StandardCardManifests';
import {TURMOIL_CARD_MANIFEST} from './turmoil/TurmoilCardManifest';
import {VENUS_CARD_MANIFEST} from './venusNext/VenusCardManifest';

export const ALL_CARD_MANIFESTS: Array<CardManifest> = [
  BASE_CARD_MANIFEST,
  CORP_ERA_CARD_MANIFEST,
  PROMO_CARD_MANIFEST,
  VENUS_CARD_MANIFEST,
  COLONIES_CARD_MANIFEST,
  PRELUDE_CARD_MANIFEST,
  TURMOIL_CARD_MANIFEST,
  COMMUNITY_CARD_MANIFEST,
  ARES_CARD_MANIFEST,
];

export const MANIFEST_BY_MODULE: Map<GameModule, CardManifest> =
    new Map(ALL_CARD_MANIFESTS.map((manifest) => [manifest.module, manifest]));

export const ALL_PROJECT_DECKS = ALL_CARD_MANIFESTS.map(
    (deck) => deck.projectCards,
);
export const ALL_CORPORATION_DECKS = ALL_CARD_MANIFESTS.map(
    (deck) => deck.corporationCards,
);
export const ALL_PRELUDE_DECKS = ALL_CARD_MANIFESTS.map(
    (deck) => deck.preludeCards,
);

export const ALL_PROJECT_CARD_NAMES = Decks.allCardNames(ALL_PROJECT_DECKS);
export const ALL_CORPORATION_CARD_NAMES = Decks.allCardNames(
    ALL_CORPORATION_DECKS,
);
export const ALL_PRELUDE_CARD_NAMES = Decks.allCardNames(ALL_PRELUDE_DECKS);
