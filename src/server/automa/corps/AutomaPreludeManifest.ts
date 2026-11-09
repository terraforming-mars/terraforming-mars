import {CardName} from '../../../common/cards/CardName';
import {AutomaManifest} from './AutomaManifest';
import {CHEUNG_SHING_MARS_MARSBOT_CORP} from './prelude/CheungShingMARSMarsBot';
import {POINT_LUNA_MARSBOT_CORP} from './prelude/PointLunaMarsBot';
import {ROBINSON_INDUSTRIES_MARSBOT_CORP} from './prelude/RobinsonIndustriesMarsBot';
import {VALLEY_TRUST_MARSBOT_CORP} from './prelude/ValleyTrustMarsBot';
import {VITOR_MARSBOT_CORP} from './prelude/VitorMarsBot';
import {ARCADIAN_COMMUNITIES_MARSBOT_CORP} from './promo/ArcadianCommunitiesMarsBot';
import {ASTRODRILL_MARSBOT_CORP} from './promo/AstrodrillMarsBot';
import {FACTORUM_MARSBOT_CORP} from './promo/FactorumMarsBot';
import {MANUTECH_MARSBOT_CORP} from './venusNext/ManutechMarsBot';
import {ECOTEC_MARSBOT_CORP} from './prelude2/EcotecMarsBot';
import {KUIPER_COOPERATIVE_MARSBOT_CORP} from './promo/KuiperCooperativeMarsBot';
import {NIRGAL_ENTERPRISES_MARSBOT_CORP} from './prelude2/NirgalEnterprisesMarsBot';
import {PALLADIN_SHIPPING_MARSBOT_CORP} from './prelude2/PalladinShippingMarsBot';
import {SAGITTA_FRONTIER_SERVICES_MARSBOT_CORP} from './prelude2/SagittaFrontierServicesMarsBot';
import {SPIRE_MARSBOT_CORP} from './prelude2/SpireMarsBot';
import {TYCHO_MAGNETICS_MARSBOT_CORP} from './promo/TychoMagneticsMarsBot';

export const AUTOMA_PRELUDE_MANIFEST: AutomaManifest = {
  corps: {
    // Prelude
    [CardName.CHEUNG_SHING_MARS]: CHEUNG_SHING_MARS_MARSBOT_CORP,
    [CardName.POINT_LUNA]: POINT_LUNA_MARSBOT_CORP,
    [CardName.ROBINSON_INDUSTRIES]: ROBINSON_INDUSTRIES_MARSBOT_CORP,
    [CardName.VALLEY_TRUST]: VALLEY_TRUST_MARSBOT_CORP,
    [CardName.VITOR]: VITOR_MARSBOT_CORP,
    // Prelude 2
    [CardName.ARCADIAN_COMMUNITIES]: ARCADIAN_COMMUNITIES_MARSBOT_CORP,
    [CardName.ASTRODRILL]: ASTRODRILL_MARSBOT_CORP,
    [CardName.FACTORUM]: FACTORUM_MARSBOT_CORP,
    [CardName.MANUTECH]: MANUTECH_MARSBOT_CORP,
    [CardName.ECOTEC]: ECOTEC_MARSBOT_CORP,
    [CardName.KUIPER_COOPERATIVE]: KUIPER_COOPERATIVE_MARSBOT_CORP,
    [CardName.NIRGAL_ENTERPRISES]: NIRGAL_ENTERPRISES_MARSBOT_CORP,
    [CardName.PALLADIN_SHIPPING]: PALLADIN_SHIPPING_MARSBOT_CORP,
    [CardName.SAGITTA_FRONTIER_SERVICES]: SAGITTA_FRONTIER_SERVICES_MARSBOT_CORP,
    [CardName.SPIRE]: SPIRE_MARSBOT_CORP,
    [CardName.TYCHO_MAGNETICS]: TYCHO_MAGNETICS_MARSBOT_CORP,
  },
};
