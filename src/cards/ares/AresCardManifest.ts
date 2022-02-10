import {CardName} from '../../common/cards/CardName';
import {GameModule} from '../../common/cards/GameModule';
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
    {cardName: CardName.BIOENGINEERING_ENCLOSURE, Factory: BioengineeringEnclosure},
    {cardName: CardName.BIOFERTILIZER_FACILITY, Factory: BiofertilizerFacility},
    {cardName: CardName.BUTTERFLY_EFFECT, Factory: ButterflyEffect},
    {cardName: CardName.CAPITAL_ARES, Factory: CapitalAres},
    {cardName: CardName.COMMERCIAL_DISTRICT_ARES, Factory: CommercialDistrictAres},
    {cardName: CardName.DESPERATE_MEASURES, Factory: DesperateMeasures},
    {cardName: CardName.ECOLOGICAL_SURVEY, Factory: EcologicalSurvey},
    {cardName: CardName.ECOLOGICAL_ZONE_ARES, Factory: EcologicalZoneAres},
    {cardName: CardName.GEOLOGICAL_SURVEY, Factory: GeologicalSurvey},
    {cardName: CardName.INDUSTRIAL_CENTER_ARES, Factory: IndustrialCenterAres},
    {cardName: CardName.LAVA_FLOWS_ARES, Factory: LavaFlowsAres},
    {cardName: CardName.MARKETING_EXPERTS, Factory: MarketingExperts},
    {cardName: CardName.METALLIC_ASTEROID, Factory: MetallicAsteroid},
    {cardName: CardName.MINING_AREA_ARES, Factory: MiningAreaAres},
    {cardName: CardName.MINING_RIGHTS_ARES, Factory: MiningRightsAres},
    {cardName: CardName.MOHOLE_AREA_ARES, Factory: MoholeAreaAres},
    {cardName: CardName.NATURAL_PRESERVE_ARES, Factory: NaturalPreserveAres},
    {cardName: CardName.NUCLEAR_ZONE_ARES, Factory: NuclearZoneAres},
    {cardName: CardName.OCEAN_CITY, Factory: OceanCity},
    {cardName: CardName.OCEAN_FARM, Factory: OceanFarm},
    {cardName: CardName.OCEAN_SANCTUARY, Factory: OceanSanctuary},
    {cardName: CardName.RESTRICTED_AREA_ARES, Factory: RestrictedAreaAres},
    {cardName: CardName.SOLAR_FARM, Factory: SolarFarm},
  ],
  cardsToRemove: [
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
