import {CardName} from '../../CardName';
import {GameModule} from '../../GameModule';
import {CardManifest} from '../CardManifest';
import {BioengineeringEnclosure} from './BioengineeringEnclosure';
import {BiofertilizerFacility} from './BiofertilizerFacility';
import {ButterflyEffect} from './ButterflyEffect';
import {CapitalAres} from './CapitalAres';
import {CommercialDistrictAres} from './CommercialDistrictAres';
import {DesperateMeasures} from './DesperateMeasures';
import {EcologicalSurvey} from './EcologicalSurvey';
import {EcologicalZoneAres} from './EcologicalZoneAres';
import {GeologicalSurvey} from './GeologicalSurvey';
import {IndustrialCenterAres} from './IndustrialCenterAres';
import {LavaFlowsAres} from './LavaFlowsAres';
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

export const ARES_CARD_MANIFEST = new CardManifest({
  module: GameModule.Ares,
  projectCards: [
    CardManifest.dynamicFactory(CardName.BIOENGINEERING_ENCLOSURE, BioengineeringEnclosure),
    CardManifest.dynamicFactory(CardName.BIOFERTILIZER_FACILITY, BiofertilizerFacility),
    CardManifest.staticFactory(CardName.BUTTERFLY_EFFECT, new ButterflyEffect()),
    CardManifest.dynamicFactory(CardName.CAPITAL_ARES, CapitalAres),
    CardManifest.dynamicFactory(CardName.COMMERCIAL_DISTRICT_ARES, CommercialDistrictAres),
    CardManifest.staticFactory(CardName.DESPERATE_MEASURES, new DesperateMeasures()),
    CardManifest.dynamicFactory(CardName.ECOLOGICAL_SURVEY, EcologicalSurvey),
    CardManifest.dynamicFactory(CardName.ECOLOGICAL_ZONE_ARES, EcologicalZoneAres),
    CardManifest.dynamicFactory(CardName.GEOLOGICAL_SURVEY, GeologicalSurvey),
    CardManifest.dynamicFactory(CardName.INDUSTRIAL_CENTER_ARES, IndustrialCenterAres),
    CardManifest.dynamicFactory(CardName.LAVA_FLOWS_ARES, LavaFlowsAres),
    CardManifest.dynamicFactory(CardName.MARKETING_EXPERTS, MarketingExperts),
    CardManifest.staticFactory(CardName.METALLIC_ASTEROID, new MetallicAsteroid()),
    CardManifest.dynamicFactory(CardName.MINING_AREA_ARES, MiningAreaAres),
    CardManifest.dynamicFactory(CardName.MINING_RIGHTS_ARES, MiningRightsAres),
    CardManifest.dynamicFactory(CardName.MOHOLE_AREA_ARES, MoholeAreaAres),
    CardManifest.dynamicFactory(CardName.NATURAL_PRESERVE_ARES, NaturalPreserveAres),
    CardManifest.dynamicFactory(CardName.NUCLEAR_ZONE_ARES, NuclearZoneAres),
    CardManifest.dynamicFactory(CardName.OCEAN_CITY, OceanCity),
    CardManifest.dynamicFactory(CardName.OCEAN_FARM, OceanFarm),
    CardManifest.dynamicFactory(CardName.OCEAN_SANCTUARY, OceanSanctuary),
    CardManifest.dynamicFactory(CardName.RESTRICTED_AREA_ARES, RestrictedAreaAres),
    CardManifest.dynamicFactory(CardName.SOLAR_FARM, SolarFarm),
  ],
  projectCardsToRemove: [
    CardName.CAPITAL,
    CardName.COMMERCIAL_DISTRICT,
    CardName.ECOLOGICAL_ZONE,
    CardName.INDUSTRIAL_CENTER,
    CardName.LAVA_FLOWS,
    CardName.MINING_AREA,
    CardName.MINING_RIGHTS,
    CardName.MOHOLE_AREA,
    CardName.NATURAL_PRESERVE,
    CardName.NUCLEAR_ZONE,
    CardName.RESTRICTED_AREA,
  ],
});
