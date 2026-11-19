import {CardName} from '../../../common/cards/CardName';
import {AutomaManifest} from './AutomaManifest';
import {PharmacyUnionMarsBot} from './promo/PharmacyUnionMarsBot';
import {PhilaresMarsBot} from './promo/PhilaresMarsBot';
import {RecyclonMarsBot} from './promo/RecyclonMarsBot';
import {SpliceMarsBot} from './promo/SpliceMarsBot';

export const AUTOMA_PROMO_MANIFEST: AutomaManifest = {
  corps: {
    [CardName.PHARMACY_UNION]: new PharmacyUnionMarsBot(),
    [CardName.PHILARES]: new PhilaresMarsBot(),
    [CardName.RECYCLON]: new RecyclonMarsBot(),
    [CardName.SPLICE]: new SpliceMarsBot(),
  },
};
