import {CardName} from '../../../common/cards/CardName';
import {AutomaManifest} from './AutomaManifest';
import {PHARMACY_UNION_MARSBOT_CORP} from './promo/PharmacyUnionMarsBot';
import {PHILARES_MARSBOT_CORP} from './promo/PhilaresMarsBot';
import {RECYCLON_MARSBOT_CORP} from './promo/RecyclonMarsBot';
import {SPLICE_MARSBOT_CORP} from './promo/SpliceMarsBot';

export const AUTOMA_PROMO_MANIFEST: AutomaManifest = {
  corps: {
    [CardName.PHARMACY_UNION]: PHARMACY_UNION_MARSBOT_CORP,
    [CardName.PHILARES]: PHILARES_MARSBOT_CORP,
    [CardName.RECYCLON]: RECYCLON_MARSBOT_CORP,
    [CardName.SPLICE]: SPLICE_MARSBOT_CORP,
  },
};
