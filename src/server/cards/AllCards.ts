import {ARES_CARD_MANIFEST} from './ares/AresCardManifest';
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
import {MOON_CARD_MANIFEST} from './moon/MoonCardManifest';
import {PATHFINDERS_CARD_MANIFEST} from './pathfinders/PathfindersCardManifest';

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
  MOON_CARD_MANIFEST,
  PATHFINDERS_CARD_MANIFEST,
];
