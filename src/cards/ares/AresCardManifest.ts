import { CardName } from "../../CardName";
import { GameModule } from "../../GameModule";
import { CardManifest } from "../CardManifest";
import { BioengineeringEnclosure } from "./BioengineeringEnclosure";
import { BiofertilizerFacility } from "./BiofertilizerFacility";
import { ButterflyEffect } from "./ButterflyEffect";
import { CapitalAres } from "./CapitalAres";
import { CommercialDistrictAres } from "./CommercialDistrictAres";
import { DesperateMeasures } from "./DesperateMeasures";
import { EcologicalSurvey } from "./EcologicalSurvey";
import { EcologicalZoneAres } from "./EcologicalZoneAres";
import { GeologicalSurvey } from "./GeologicalSurvey";
import { IndustrialCenterAres } from "./IndustrialCenterAres";
import { LavaFlowsAres } from "./LavaFlowsAres";
import { MarketingExperts } from "./MarketingExperts";
import { MetallicAsteroid } from "./MetallicAsteroid";
import { MiningAreaAres } from "./MiningAreaAres";
import { MiningRightsAres } from "./MiningRightsAres";
import { MoholeAreaAres } from "./MoholeAreaAres";
import { NaturalPreserveAres } from "./NaturalPreserveAres";
import { NuclearZoneAres } from "./NuclearZoneAres";
import { OceanCity } from "./OceanCity";
import { OceanFarm } from "./OceanFarm";
import { OceanSanctuary } from "./OceanSanctuary";
import { RestrictedAreaAres } from "./RestrictedAreaAres";
import { SolarFarm } from "./SolarFarm";

export const ARES_CARD_MANIFEST = new CardManifest({
    module: GameModule.Ares,
    projectCards: [
        { cardName: CardName.BIOENGINEERING_ENCLOSURE, factory: BioengineeringEnclosure },
        { cardName: CardName.BIOFERTILIZER_FACILITY, factory: BiofertilizerFacility },
        { cardName: CardName.BUTTERFLY_EFFECT, factory: ButterflyEffect },
        { cardName: CardName.CAPITAL_ARES, factory: CapitalAres },
        { cardName: CardName.COMMERCIAL_DISTRICT_ARES, factory: CommercialDistrictAres },
        { cardName: CardName.DESPERATE_MEASURES, factory: DesperateMeasures },
        { cardName: CardName.ECOLOGICAL_SURVEY, factory: EcologicalSurvey },
        { cardName: CardName.ECOLOGICAL_ZONE_ARES, factory: EcologicalZoneAres },
        { cardName: CardName.GEOLOGICAL_SURVEY, factory: GeologicalSurvey },
        { cardName: CardName.INDUSTRIAL_CENTER_ARES, factory: IndustrialCenterAres },
        { cardName: CardName.LAVA_FLOWS_ARES, factory: LavaFlowsAres },
        { cardName: CardName.MARKETING_EXPERTS, factory: MarketingExperts },
        { cardName: CardName.METALLIC_ASTEROID, factory: MetallicAsteroid },
        { cardName: CardName.MINING_AREA_ARES, factory: MiningAreaAres },
        { cardName: CardName.MINING_RIGHTS_ARES, factory: MiningRightsAres },
        { cardName: CardName.MOHOLE_AREA_ARES, factory: MoholeAreaAres },
        { cardName: CardName.NATURAL_PRESERVE_ARES, factory: NaturalPreserveAres },
        { cardName: CardName.NUCLEAR_ZONE_ARES, factory: NuclearZoneAres },
        { cardName: CardName.OCEAN_CITY, factory: OceanCity },
        { cardName: CardName.OCEAN_FARM, factory: OceanFarm },
        { cardName: CardName.OCEAN_SANCTUARY, factory: OceanSanctuary },
        { cardName: CardName.RESTRICTED_AREA_ARES, factory: RestrictedAreaAres },
        { cardName: CardName.SOLAR_FARM, factory: SolarFarm },
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
    ]
});