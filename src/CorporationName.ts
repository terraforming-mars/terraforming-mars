import { OriginalCorporation } from './cards/corporation/OriginalCorporation';
import { PreludeCorporation } from './cards/prelude/PreludeCorporation';
import { VenusCorporation } from './cards/venusNext/VenusCorporation';
import { ColoniesCorporation } from './cards/colonies/ColoniesCorporation';
import { TurmoilCorporation } from './cards/turmoil/TurmoilCorporation';

export const CorporationName =  { ...OriginalCorporation, ...PreludeCorporation, ...VenusCorporation, ...ColoniesCorporation, ...TurmoilCorporation }
export type CorporationName = typeof OriginalCorporation | PreludeCorporation | VenusCorporation | ColoniesCorporation | TurmoilCorporation | string;