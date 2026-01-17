import {GlobalEventName} from '@/common/turmoil/globalEvents/GlobalEventName';
import {CardName} from '@/common/cards/CardName';
import {ModuleManifest} from '@/server/cards/ModuleManifest';
import {AerialLenses} from '@/server/cards/turmoil/AerialLenses';
import {BannedDelegate} from '@/server/cards/turmoil/BannedDelegate';
import {CulturalMetropolis} from '@/server/cards/turmoil/CulturalMetropolis';
import {DiasporaMovement} from '@/server/cards/turmoil/DiasporaMovement';
import {EventAnalysts} from '@/server/cards/turmoil/EventAnalysts';
import {GMOContract} from '@/server/cards/turmoil/GMOContract';
import {LakefrontResorts} from '@/server/cards/turmoil/LakefrontResorts';
import {MartianMediaCenter} from '@/server/cards/turmoil/MartianMediaCenter';
import {ParliamentHall} from '@/server/cards/turmoil/ParliamentHall';
import {PoliticalAlliance} from '@/server/cards/turmoil/PoliticalAlliance';
import {Pristar} from '@/server/cards/turmoil/Pristar';
import {PROffice} from '@/server/cards/turmoil/PROffice';
import {PublicCelebrations} from '@/server/cards/turmoil/PublicCelebrations';
import {Recruitment} from '@/server/cards/turmoil/Recruitment';
import {RedTourismWave} from '@/server/cards/turmoil/RedTourismWave';
import {SeptumTribus} from '@/server/cards/turmoil/SeptumTribus';
import {SponsoredMohole} from '@/server/cards/turmoil/SponsoredMohole';
import {SupportedResearch} from '@/server/cards/turmoil/SupportedResearch';
import {TerralabsResearch} from '@/server/cards/turmoil/TerralabsResearch';
import {UtopiaInvest} from '@/server/cards/turmoil/UtopiaInvest';
import {VoteOfNoConfidence} from '@/server/cards/turmoil/VoteOfNoConfidence';
import {WildlifeDome} from '@/server/cards/turmoil/WildlifeDome';
import {AquiferReleasedByPublicCouncil} from '@/server/turmoil/globalEvents/AquiferReleasedByPublicCouncil';
import {CelebrityLeaders} from '@/server/turmoil/globalEvents/CelebrityLeaders';
import {CloudSocieties} from '@/server/turmoil/globalEvents/CloudSocieties';
import {CorrosiveRain} from '@/server/turmoil/globalEvents/CorrosiveRain';
import {Diversity} from '@/server/turmoil/globalEvents/Diversity';
import {DryDeserts} from '@/server/turmoil/globalEvents/DryDeserts';
import {EcoSabotage} from '@/server/turmoil/globalEvents/EcoSabotage';
import {Election} from '@/server/turmoil/globalEvents/Election';
import {GenerousFunding} from '@/server/turmoil/globalEvents/GenerousFunding';
import {GlobalDustStorm} from '@/server/turmoil/globalEvents/GlobalDustStorm';
import {HomeworldSupport} from '@/server/turmoil/globalEvents/HomeworldSupport';
import {ImprovedEnergyTemplates} from '@/server/turmoil/globalEvents/ImprovedEnergyTemplates';
import {JovianTaxRights} from '@/server/turmoil/globalEvents/JovianTaxRights';
import {MicrogravityHealthProblems} from '@/server/turmoil/globalEvents/MicrogravityHealthProblems';
import {MinersOnStrike} from '@/server/turmoil/globalEvents/MinersOnStrike';
import {MudSlides} from '@/server/turmoil/globalEvents/MudSlides';
import {Pandemic} from '@/server/turmoil/globalEvents/Pandemic';
import {ParadigmBreakdown} from '@/server/turmoil/globalEvents/ParadigmBreakdown';
import {Productivity} from '@/server/turmoil/globalEvents/Productivity';
import {RedInfluence} from '@/server/turmoil/globalEvents/RedInfluence';
import {Revolution} from '@/server/turmoil/globalEvents/Revolution';
import {Riots} from '@/server/turmoil/globalEvents/Riots';
import {ScientificCommunity} from '@/server/turmoil/globalEvents/ScientificCommunity';
import {SnowCover} from '@/server/turmoil/globalEvents/SnowCover';
import {SolarFlare} from '@/server/turmoil/globalEvents/SolarFlare';
import {SolarnetShutdown} from '@/server/turmoil/globalEvents/SolarnetShutdown';
import {SpinoffProducts} from '@/server/turmoil/globalEvents/SpinoffProducts';
import {SponsoredProjects} from '@/server/turmoil/globalEvents/SponsoredProjects';
import {StrongSociety} from '@/server/turmoil/globalEvents/StrongSociety';
import {SuccessfulOrganisms} from '@/server/turmoil/globalEvents/SuccessfulOrganisms';
import {VenusInfrastructure} from '@/server/turmoil/globalEvents/VenusInfrastructure';
import {VolcanicEruptions} from '@/server/turmoil/globalEvents/VolcanicEruptions';
import {WarOnEarth} from '@/server/turmoil/globalEvents/WarOnEarth';
import {AsteroidMining} from '@/server/turmoil/globalEvents/AsteroidMining';
import {Sabotage} from '@/server/turmoil/globalEvents/Sabotage';
import {InterplanetaryTrade} from '@/server/turmoil/globalEvents/InterplanetaryTrade';

export const TURMOIL_CARD_MANIFEST = new ModuleManifest({
  module: 'turmoil',
  projectCards: {
    [CardName.AERIAL_LENSES]: {Factory: AerialLenses},
    [CardName.BANNED_DELEGATE]: {Factory: BannedDelegate},
    [CardName.CULTURAL_METROPOLIS]: {Factory: CulturalMetropolis},
    [CardName.DIASPORA_MOVEMENT]: {Factory: DiasporaMovement},
    [CardName.EVENT_ANALYSTS]: {Factory: EventAnalysts},
    [CardName.GMO_CONTRACT]: {Factory: GMOContract},
    [CardName.MARTIAN_MEDIA_CENTER]: {Factory: MartianMediaCenter},
    [CardName.PARLIAMENT_HALL]: {Factory: ParliamentHall},
    [CardName.PR_OFFICE]: {Factory: PROffice},
    [CardName.POLITICAL_ALLIANCE]: {Factory: PoliticalAlliance},
    [CardName.PUBLIC_CELEBRATIONS]: {Factory: PublicCelebrations},
    [CardName.RECRUITMENT]: {Factory: Recruitment},
    [CardName.RED_TOURISM_WAVE]: {Factory: RedTourismWave},
    [CardName.SPONSORED_MOHOLE]: {Factory: SponsoredMohole},
    [CardName.SUPPORTED_RESEARCH]: {Factory: SupportedResearch},
    [CardName.WILDLIFE_DOME]: {Factory: WildlifeDome},
    [CardName.VOTE_OF_NO_CONFIDENCE]: {Factory: VoteOfNoConfidence},
  },

  corporationCards: {
    [CardName.LAKEFRONT_RESORTS]: {Factory: LakefrontResorts},
    [CardName.PRISTAR]: {Factory: Pristar},
    [CardName.TERRALABS_RESEARCH]: {Factory: TerralabsResearch},
    [CardName.UTOPIA_INVEST]: {Factory: UtopiaInvest},
    [CardName.SEPTUM_TRIBUS]: {Factory: SeptumTribus, compatibility: 'turmoil'},
  },
  globalEvents: {
    [GlobalEventName.JOVIAN_TAX_RIGHTS]: {Factory: JovianTaxRights, compatibility: 'colonies'},
    [GlobalEventName.MICROGRAVITY_HEALTH_PROBLEMS]: {Factory: MicrogravityHealthProblems, compatibility: 'colonies', negative: true},
    [GlobalEventName.CLOUD_SOCIETIES]: {Factory: CloudSocieties, compatibility: ['venus', 'colonies']},
    [GlobalEventName.CORROSIVE_RAIN]: {Factory: CorrosiveRain, compatibility: ['venus', 'colonies'], negative: true},
    [GlobalEventName.VENUS_INFRASTRUCTURE]: {Factory: VenusInfrastructure, compatibility: 'venus'},
    [GlobalEventName.SPONSORED_PROJECTS]: {Factory: SponsoredProjects},
    [GlobalEventName.ASTEROID_MINING]: {Factory: AsteroidMining},
    [GlobalEventName.GENEROUS_FUNDING]: {Factory: GenerousFunding},
    [GlobalEventName.SUCCESSFUL_ORGANISMS]: {Factory: SuccessfulOrganisms},
    [GlobalEventName.PRODUCTIVITY]: {Factory: Productivity},
    [GlobalEventName.HOMEWORLD_SUPPORT]: {Factory: HomeworldSupport},
    [GlobalEventName.VOLCANIC_ERUPTIONS]: {Factory: VolcanicEruptions},
    [GlobalEventName.DIVERSITY]: {Factory: Diversity},
    [GlobalEventName.IMPROVED_ENERGY_TEMPLATES]: {Factory: ImprovedEnergyTemplates},
    [GlobalEventName.INTERPLANETARY_TRADE]: {Factory: InterplanetaryTrade},
    [GlobalEventName.CELEBRITY_LEADERS]: {Factory: CelebrityLeaders},
    [GlobalEventName.SPINOFF_PRODUCTS]: {Factory: SpinoffProducts},
    [GlobalEventName.ELECTION]: {Factory: Election},
    [GlobalEventName.AQUIFER_RELEASED_BY_PUBLIC_COUNCIL]: {Factory: AquiferReleasedByPublicCouncil},
    [GlobalEventName.SCIENTIFIC_COMMUNITY]: {Factory: ScientificCommunity},
    [GlobalEventName.STRONG_SOCIETY]: {Factory: StrongSociety},
    [GlobalEventName.GLOBAL_DUST_STORM]: {Factory: GlobalDustStorm, negative: true},
    [GlobalEventName.ECO_SABOTAGE]: {Factory: EcoSabotage, negative: true},
    [GlobalEventName.MINERS_ON_STRIKE]: {Factory: MinersOnStrike, negative: true},
    [GlobalEventName.MUD_SLIDES]: {Factory: MudSlides, negative: true},
    [GlobalEventName.REVOLUTION]: {Factory: Revolution, negative: true},
    [GlobalEventName.RIOTS]: {Factory: Riots, negative: true},
    [GlobalEventName.SABOTAGE]: {Factory: Sabotage, negative: true},
    [GlobalEventName.SNOW_COVER]: {Factory: SnowCover, negative: true},
    [GlobalEventName.PANDEMIC]: {Factory: Pandemic, negative: true},
    [GlobalEventName.WAR_ON_EARTH]: {Factory: WarOnEarth, negative: true},
    [GlobalEventName.PARADIGM_BREAKDOWN]: {Factory: ParadigmBreakdown, negative: true},
    [GlobalEventName.DRY_DESERTS]: {Factory: DryDeserts, negative: true},
    [GlobalEventName.RED_INFLUENCE]: {Factory: RedInfluence, negative: true},
    [GlobalEventName.SOLARNET_SHUTDOWN]: {Factory: SolarnetShutdown, negative: true},
    [GlobalEventName.SOLAR_FLARE]: {Factory: SolarFlare, negative: true},
  },
});

