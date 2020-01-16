import { OriginalCorporation } from './cards/corporation/OriginalCorporation';
import { PreludeCorporation } from './cards/prelude/PreludeCorporation';
import { VenusCorporation } from './cards/venusNext/VenusCorporation';

export const CorporationName =  { ...OriginalCorporation, ...PreludeCorporation, ...VenusCorporation }
export type CorporationName = typeof OriginalCorporation | PreludeCorporation | VenusCorporation;