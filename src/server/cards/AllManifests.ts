import {ARES_CARD_MANIFEST} from '@/server/cards/ares/AresCardManifest';
import {ModuleManifest} from '@/server/cards/ModuleManifest';
import {COLONIES_CARD_MANIFEST} from '@/server/cards/colonies/ColoniesCardManifest';
import {COMMUNITY_CARD_MANIFEST} from '@/server/cards/community/CommunityCardManifest';
import {PRELUDE_CARD_MANIFEST} from '@/server/cards/prelude/PreludeCardManifest';
import {PROMO_CARD_MANIFEST} from '@/server/cards/promo/PromoCardManifest';
import {CEO_CARD_MANIFEST} from '@/server/cards/ceos/CeoCardManifest';
import {
  BASE_CARD_MANIFEST,
  CORP_ERA_CARD_MANIFEST,
} from '@/server/cards/StandardCardManifests';
import {TURMOIL_CARD_MANIFEST} from '@/server/cards/turmoil/TurmoilCardManifest';
import {VENUS_CARD_MANIFEST} from '@/server/cards/venusNext/VenusCardManifest';
import {MOON_CARD_MANIFEST} from '@/server/cards/moon/MoonCardManifest';
import {PATHFINDERS_CARD_MANIFEST} from '@/server/cards/pathfinders/PathfindersCardManifest';
import {PRELUDE2_CARD_MANIFEST} from '@/server/cards/prelude2/Prelude2CardManifest';
import {STAR_WARS_CARD_MANIFEST} from '@/server/cards/starwars/StarwarsCardManifest';
import {UNDERWORLD_CARD_MANIFEST} from '@/server/cards/underworld/UnderworldCardManifest';

export const ALL_MODULE_MANIFESTS: Array<ModuleManifest> = [
  BASE_CARD_MANIFEST,
  CORP_ERA_CARD_MANIFEST,
  PROMO_CARD_MANIFEST,
  VENUS_CARD_MANIFEST,
  COLONIES_CARD_MANIFEST,
  PRELUDE_CARD_MANIFEST,
  PRELUDE2_CARD_MANIFEST,
  TURMOIL_CARD_MANIFEST,
  COMMUNITY_CARD_MANIFEST,
  ARES_CARD_MANIFEST,
  MOON_CARD_MANIFEST,
  PATHFINDERS_CARD_MANIFEST,
  CEO_CARD_MANIFEST,
  STAR_WARS_CARD_MANIFEST,
  UNDERWORLD_CARD_MANIFEST,
];
