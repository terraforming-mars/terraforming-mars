import {CardName} from '../../../common/cards/CardName';
import {ModuleManifest} from '../ModuleManifest';
import {BioengineeringEnclosure} from './BioengineeringEnclosure';
import {BiofertilizerFacility} from './BiofertilizerFacility';
import {ButterflyEffect} from './ButterflyEffect';
import {CapitalAres} from './CapitalAres';
import {CommercialDistrictAres} from './CommercialDistrictAres';
import {DeimosDownAres} from './DeimosDownAres';
import {DesperateMeasures} from './DesperateMeasures';
import {EcologicalSurvey} from './EcologicalSurvey';
import {EcologicalZoneAres} from './EcologicalZoneAres';
import {GeologicalSurvey} from './GeologicalSurvey';
import {GreatDamAres} from './GreatDamAres';
import {IndustrialCenterAres} from './IndustrialCenterAres';
import {LavaFlowsAres} from './LavaFlowsAres';
import {MagneticFieldGeneratorsAres} from './MagneticFieldGeneratorsAres';
import {MarketingExperts} from './MarketingExperts';
import {MetallicAsteroid} from './MetallicAsteroid';
import {MiningAreaAres} from './MiningAreaAres';
import {MiningRightsAres} from './MiningRightsAres';
import {MoholeAreaAres} from './MoholeAreaAres';
import {NaturalPreserveAres} from './NaturalPreserveAres';
import {NuclearZoneAres} from './NuclearZoneAres';
import {OceanCity} from './OceanCity';
import {OceanFarm} from './OceanFarm';
import {OceanSanctuary} from './OceanSanctuary';
import {RestrictedAreaAres} from './RestrictedAreaAres';
import {SolarFarm} from './SolarFarm';

export const ARES_CARD_MANIFEST = new ModuleManifest({
  module: 'ares',
  projectCards: {
    [CardName.BIOENGINEERING_ENCLOSURE]: {Factory: BioengineeringEnclosure},
    [CardName.BIOFERTILIZER_FACILITY]: {Factory: BiofertilizerFacility},
    [CardName.BUTTERFLY_EFFECT]: {Factory: ButterflyEffect},
    [CardName.CAPITAL_ARES]: {Factory: CapitalAres},
    [CardName.COMMERCIAL_DISTRICT_ARES]: {Factory: CommercialDistrictAres},
    [CardName.DEIMOS_DOWN_ARES]: {Factory: DeimosDownAres},
    [CardName.DESPERATE_MEASURES]: {Factory: DesperateMeasures},
    [CardName.ECOLOGICAL_SURVEY]: {Factory: EcologicalSurvey},
    [CardName.ECOLOGICAL_ZONE_ARES]: {Factory: EcologicalZoneAres},
    [CardName.GEOLOGICAL_SURVEY]: {Factory: GeologicalSurvey},
    [CardName.INDUSTRIAL_CENTER_ARES]: {Factory: IndustrialCenterAres},
    [CardName.GREAT_DAM_ARES]: {Factory: GreatDamAres},
    [CardName.LAVA_FLOWS_ARES]: {Factory: LavaFlowsAres},
    [CardName.MAGNETIC_FIELD_GENERATORS_ARES]: {Factory: MagneticFieldGeneratorsAres},
    [CardName.MARKETING_EXPERTS]: {Factory: MarketingExperts},
    [CardName.METALLIC_ASTEROID]: {Factory: MetallicAsteroid},
    [CardName.MINING_AREA_ARES]: {Factory: MiningAreaAres},
    [CardName.MINING_RIGHTS_ARES]: {Factory: MiningRightsAres},
    [CardName.MOHOLE_AREA_ARES]: {Factory: MoholeAreaAres},
    [CardName.NATURAL_PRESERVE_ARES]: {Factory: NaturalPreserveAres},
    [CardName.NUCLEAR_ZONE_ARES]: {Factory: NuclearZoneAres},
    [CardName.OCEAN_CITY]: {Factory: OceanCity},
    [CardName.OCEAN_FARM]: {Factory: OceanFarm},
    [CardName.OCEAN_SANCTUARY]: {Factory: OceanSanctuary},
    [CardName.RESTRICTED_AREA_ARES]: {Factory: RestrictedAreaAres},
    [CardName.SOLAR_FARM]: {Factory: SolarFarm},
  },
  cardsToRemove: [
    CardName.CAPITAL,
    CardName.COMMERCIAL_DISTRICT,
    CardName.DEIMOS_DOWN,
    CardName.DEIMOS_DOWN_PROMO,
    CardName.ECOLOGICAL_ZONE,
    CardName.GREAT_DAM,
    CardName.GREAT_DAM_PROMO,
    CardName.INDUSTRIAL_CENTER,
    CardName.LAVA_FLOWS,
    CardName.MAGNETIC_FIELD_GENERATORS,
    CardName.MAGNETIC_FIELD_GENERATORS_PROMO,
    CardName.MINING_AREA,
    CardName.MINING_RIGHTS,
    CardName.MOHOLE_AREA,
    CardName.NATURAL_PRESERVE,
    CardName.NUCLEAR_ZONE,
    CardName.RESTRICTED_AREA,
  ],
});
