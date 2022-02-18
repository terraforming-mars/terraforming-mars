import {CardName} from '@/common/cards/CardName';
import {CardModel} from '@/common/models/CardModel';

export function sortActiveCards(inCards: Array<CardModel>): Array<CardModel> {
  const firstCardIndex = -1;
  return inCards.slice().sort(function(cardA: CardModel, cardB: CardModel) {
    return (ActiveCardsSortingOrder.get(cardA.name) || firstCardIndex) - (ActiveCardsSortingOrder.get(cardB.name) || firstCardIndex);
  });
}

export const ActiveCardsSortingOrder: Map<CardName, number> = new Map([
  // Universal discount
  CardName.EARTH_CATAPULT,
  CardName.ANTI_GRAVITY_TECHNOLOGY,
  CardName.SKY_DOCKS,
  CardName.RESEARCH_OUTPOST,

  // Space discount
  CardName.WARP_DRIVE,
  CardName.MASS_CONVERTER,
  CardName.QUANTUM_EXTRACTOR,
  CardName.SPACE_STATION,
  CardName.SHUTTLES,

  // Other discount
  CardName.CUTTING_EDGE_TECHNOLOGY,
  CardName.EARTH_OFFICE,
  CardName.VENUS_WAYSTATION,

  // Rebate
  CardName.MEDIA_GROUP,
  CardName.OPTIMAL_AEROBRAKING,
  CardName.STANDARD_TECHNOLOGY,
  CardName.ROVER_CONSTRUCTION,
  CardName.GMO_CONTRACT,
  CardName.MEAT_INDUSTRY,
  CardName.TOPSOIL_CONTRACT,

  // Colonies
  CardName.TRADING_COLONY,
  CardName.TRADE_ENVOYS,
  CardName.CRYO_SLEEP,
  CardName.RIM_FREIGHTERS,

  // Cash generator
  CardName.ELECTRO_CATAPULT,
  CardName.SPACE_ELEVATOR,
  CardName.ENERGY_MARKET,
  CardName.ORBITAL_CLEANUP,
  CardName.MARTIAN_ZOO,
  CardName.MARTIAN_RAILS,
  CardName.POWER_INFRASTRUCTURE,
  CardName.MELTWORKS,

  // Card draw (active)
  CardName.AI_CENTRAL,
  CardName.SUB_CRUST_MEASUREMENTS,
  CardName.RESTRICTED_AREA,
  CardName.RESTRICTED_AREA_ARES,
  CardName.DEVELOPMENT_CENTER,
  CardName.HI_TECH_LAB,
  CardName.RED_SPOT_OBSERVATORY,
  CardName.AERIAL_MAPPERS,
  CardName.INVENTORS_GUILD,
  CardName.BUSINESS_NETWORK,

  // Card draw (passive)
  CardName.MARS_UNIVERSITY,
  CardName.OLYMPUS_CONFERENCE,
  CardName.SPINOFF_DEPARTMENT,

  // Non-jovian floaters
  CardName.ATMO_COLLECTORS,
  CardName.DEUTERIUM_EXPORT,
  CardName.FLOATING_HABS,
  CardName.DIRIGIBLES,
  CardName.FLOATER_TECHNOLOGY,
  CardName.STRATOPOLIS,
  CardName.EXTRACTOR_BALLOONS,
  CardName.FORCED_PRECIPITATION,
  CardName.JET_STREAM_MICROSCRAPPERS,
  CardName.LOCAL_SHADING,

  // Jovian floater
  CardName.TITAN_SHUTTLES,
  CardName.JOVIAN_LANTERNS,
  CardName.TITAN_AIRSCRAPPING,
  CardName.TITAN_FLOATING_LAUNCHPAD,
  CardName.JUPITER_FLOATING_STATION,
  CardName.SATURN_SURFING,

  // Asteroid cards
  CardName.ASTEROID_RIGHTS,
  CardName.ASTEROID_DEFLECTION_SYSTEM,
  CardName.COMET_AIMING,
  CardName.ROTATOR_IMPACTS,
  CardName.DIRECTED_IMPACTORS,
  CardName.ASTEROID_HOLLOWING,

  // energy engine
  CardName.PHYSICS_COMPLEX,
  CardName.ORE_PROCESSOR,
  CardName.STEELWORKS,
  CardName.IRONWORKS,
  CardName.WATER_SPLITTING_PLANT,

  // TR engine
  CardName.VENUS_MAGNETIZER,
  CardName.EQUATORIAL_MAGNETIZER,
  CardName.AQUIFER_PUMPING,
  CardName.WATER_IMPORT_FROM_EUROPA,
  CardName.CARETAKER_CONTRACT,

  // Other useful actions
  CardName.SELF_REPLICATING_ROBOTS,
  CardName.MARTIAN_MEDIA_CENTER,
  CardName.SPACE_MIRRORS,
  CardName.INDUSTRIAL_CENTER,
  CardName.INDUSTRIAL_CENTER_ARES,
  CardName.UNDERGROUND_DETONATIONS,

  // Animals (active)
  CardName.PREDATORS,
  CardName.PENGUINS,
  CardName.FISH,
  CardName.BIRDS,
  CardName.LIVESTOCK,
  CardName.STRATOSPHERIC_BIRDS,
  CardName.BIOENGINEERING_ENCLOSURE,
  CardName.SMALL_ANIMALS,
  CardName.SUBZERO_SALT_FISH,

  // Animals (passive)
  CardName.VENUSIAN_ANIMALS,
  CardName.OCEAN_SANCTUARY,
  CardName.PETS,
  CardName.ECOLOGICAL_ZONE,
  CardName.ECOLOGICAL_ZONE_ARES,
  CardName.HERBIVORES,

  // Microbes
  CardName.SULPHUR_EATING_BACTERIA,
  CardName.PSYCHROPHILES,
  CardName.EXTREME_COLD_FUNGUS,
  CardName.SYMBIOTIC_FUNGUS,
  CardName.EXTREMOPHILES,
  CardName.ANTS,
  CardName.VENUSIAN_INSECTS,
  CardName.REGOLITH_EATERS,
  CardName.GHG_PRODUCING_BACTERIA,
  CardName.THERMOPHILES,
  CardName.NITRITE_REDUCING_BACTERIA,
  CardName.TARDIGRADES,
  CardName.DECOMPOSERS,

  // Point generator
  CardName.MAXWELL_BASE,
  CardName.MOHOLE_LAKE,
  CardName.SEARCH_FOR_LIFE,
  CardName.REFUGEE_CAMP,
  CardName.SECURITY_FLEET,

  // Other passive cards
  CardName.EVENT_ANALYSTS,
  CardName.PROTECTED_HABITATS,
  CardName.ARCTIC_ALGAE,
  CardName.VIRAL_ENHANCERS,
  CardName.ECOLOGICAL_SURVEY,
  CardName.ADAPTATION_TECHNOLOGY,
  CardName.GEOLOGICAL_SURVEY,
  CardName.IMMIGRANT_CITY,
  CardName.ADVERTISING,
  CardName.MARKETING_EXPERTS,

  // Alloys
  CardName.ADVANCED_ALLOYS,
  CardName.REGO_PLASTICS,
  CardName.MERCURIAN_ALLOYS,
].map((card, index) => [card, index+1]));
