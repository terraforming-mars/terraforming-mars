import {CardName} from '../../../common/cards/CardName';
import {AutomaManifest} from './AutomaManifest';
import {CheungShingMARSMarsBot} from './prelude/CheungShingMARSMarsBot';
import {PointLunaMarsBot} from './prelude/PointLunaMarsBot';
import {RobinsonIndustriesMarsBot} from './prelude/RobinsonIndustriesMarsBot';
import {ValleyTrustMarsBot} from './prelude/ValleyTrustMarsBot';
import {VitorMarsBot} from './prelude/VitorMarsBot';
import {ArcadianCommunitiesMarsBot} from './promo/ArcadianCommunitiesMarsBot';
import {AstrodrillMarsBot} from './promo/AstrodrillMarsBot';
import {FactorumMarsBot} from './promo/FactorumMarsBot';
import {ManutechMarsBot} from './venusNext/ManutechMarsBot';
import {EcotecMarsBot} from './prelude2/EcotecMarsBot';
import {KuiperCooperativeMarsBot} from './promo/KuiperCooperativeMarsBot';
import {NirgalEnterprisesMarsBot} from './prelude2/NirgalEnterprisesMarsBot';
import {PalladinShippingMarsBot} from './prelude2/PalladinShippingMarsBot';
import {SagittaFrontierServicesMarsBot} from './prelude2/SagittaFrontierServicesMarsBot';
import {SpireMarsBot} from './prelude2/SpireMarsBot';
import {TychoMagneticsMarsBot} from './promo/TychoMagneticsMarsBot';

export const AUTOMA_PRELUDE_MANIFEST: AutomaManifest = {
  corps: {
    // Prelude
    [CardName.CHEUNG_SHING_MARS]: new CheungShingMARSMarsBot(),
    [CardName.POINT_LUNA]: new PointLunaMarsBot(),
    [CardName.ROBINSON_INDUSTRIES]: new RobinsonIndustriesMarsBot(),
    [CardName.VALLEY_TRUST]: new ValleyTrustMarsBot(),
    [CardName.VITOR]: new VitorMarsBot(),
    // Prelude 2
    [CardName.ARCADIAN_COMMUNITIES]: new ArcadianCommunitiesMarsBot(),
    [CardName.ASTRODRILL]: new AstrodrillMarsBot(),
    [CardName.FACTORUM]: new FactorumMarsBot(),
    [CardName.MANUTECH]: new ManutechMarsBot(),
    [CardName.ECOTEC]: new EcotecMarsBot(),
    [CardName.KUIPER_COOPERATIVE]: new KuiperCooperativeMarsBot(),
    [CardName.NIRGAL_ENTERPRISES]: new NirgalEnterprisesMarsBot(),
    [CardName.PALLADIN_SHIPPING]: new PalladinShippingMarsBot(),
    [CardName.SAGITTA_FRONTIER_SERVICES]: new SagittaFrontierServicesMarsBot(),
    [CardName.SPIRE]: new SpireMarsBot(),
    [CardName.TYCHO_MAGNETICS]: new TychoMagneticsMarsBot(),
  },
};
