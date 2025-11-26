import {CardName} from '@/common/cards/CardName';
import {ModuleManifest} from '@/server/cards/ModuleManifest';
import {BioengineeringEnclosure} from '@/server/cards/ares/BioengineeringEnclosure';
import {BiofertilizerFacility} from '@/server/cards/ares/BiofertilizerFacility';
import {ButterflyEffect} from '@/server/cards/ares/ButterflyEffect';
import {CapitalAres} from '@/server/cards/ares/CapitalAres';
import {CommercialDistrictAres} from '@/server/cards/ares/CommercialDistrictAres';
import {DeimosDownAres} from '@/server/cards/ares/DeimosDownAres';
import {DesperateMeasures} from '@/server/cards/ares/DesperateMeasures';
import {EcologicalSurvey} from '@/server/cards/ares/EcologicalSurvey';
import {EcologicalZoneAres} from '@/server/cards/ares/EcologicalZoneAres';
import {GeologicalSurvey} from '@/server/cards/ares/GeologicalSurvey';
import {GreatDamAres} from '@/server/cards/ares/GreatDamAres';
import {IndustrialCenterAres} from '@/server/cards/ares/IndustrialCenterAres';
import {LavaFlowsAres} from '@/server/cards/ares/LavaFlowsAres';
import {MagneticFieldGeneratorsAres} from '@/server/cards/ares/MagneticFieldGeneratorsAres';
import {MarketingExperts} from '@/server/cards/ares/MarketingExperts';
import {MetallicAsteroid} from '@/server/cards/ares/MetallicAsteroid';
import {MiningAreaAres} from '@/server/cards/ares/MiningAreaAres';
import {MiningRightsAres} from '@/server/cards/ares/MiningRightsAres';
import {MoholeAreaAres} from '@/server/cards/ares/MoholeAreaAres';
import {NaturalPreserveAres} from '@/server/cards/ares/NaturalPreserveAres';
import {NuclearZoneAres} from '@/server/cards/ares/NuclearZoneAres';
import {OceanCity} from '@/server/cards/ares/OceanCity';
import {OceanFarm} from '@/server/cards/ares/OceanFarm';
import {OceanSanctuary} from '@/server/cards/ares/OceanSanctuary';
import {RestrictedAreaAres} from '@/server/cards/ares/RestrictedAreaAres';
import {SolarFarm} from '@/server/cards/ares/SolarFarm';

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
