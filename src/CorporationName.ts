import { OriginalCorporation } from "./cards/corporation/OriginalCorporation";
import { PreludeCorporation } from "./cards/prelude/PreludeCorporation";
import { VenusCorporation } from "./cards/venusNext/VenusCorporation";
import { ColoniesCorporation } from "./cards/colonies/ColoniesCorporation";
import { TurmoilCorporation } from "./cards/turmoil/TurmoilCorporation";
import { PromoCorporation } from "./cards/promo/PromoCorporation";
import { CommunityCorporation } from "./cards/community/CommunityCorporation";

export const CorporationName =  { ...OriginalCorporation, ...PreludeCorporation, ...VenusCorporation, ...ColoniesCorporation, ...TurmoilCorporation, ...PromoCorporation, ...CommunityCorporation }
export type CorporationName = typeof OriginalCorporation | PreludeCorporation | VenusCorporation | ColoniesCorporation | TurmoilCorporation | PromoCorporation | CommunityCorporation | string;
export enum CorporationGroup {
  ORIGINAL = "Original",
  PRELUDE = "Prelude",
  VENUS_NEXT = "Venus Next",
  COLONIES = "Colonies",
  TURMOIL = "Turmoil",
  PROMO = "Promo",
  COMMUNITY = "Community"
}

