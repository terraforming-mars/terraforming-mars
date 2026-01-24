import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {CardName} from '../../../common/cards/CardName';
import {ModuleManifest} from '../ModuleManifest';
import {AerialLenses} from './AerialLenses';
import {BannedDelegate} from './BannedDelegate';
import {CulturalMetropolis} from './CulturalMetropolis';
import {DiasporaMovement} from './DiasporaMovement';
import {EventAnalysts} from './EventAnalysts';
import {GMOContract} from './GMOContract';
import {LakefrontResorts} from './LakefrontResorts';
import {MartianMediaCenter} from './MartianMediaCenter';
import {ParliamentHall} from './ParliamentHall';
import {PoliticalAlliance} from './PoliticalAlliance';
import {Pristar} from './Pristar';
import {PROffice} from './PROffice';
import {PublicCelebrations} from './PublicCelebrations';
import {Recruitment} from './Recruitment';
import {RedTourismWave} from './RedTourismWave';
import {SeptumTribus} from './SeptumTribus';
import {SponsoredMohole} from './SponsoredMohole';
import {SupportedResearch} from './SupportedResearch';
import {TerralabsResearch} from './TerralabsResearch';
import {UtopiaInvest} from './UtopiaInvest';
import {VoteOfNoConfidence} from './VoteOfNoConfidence';
import {WildlifeDome} from './WildlifeDome';
import {AquiferReleasedByPublicCouncil} from '../../turmoil/globalEvents/AquiferReleasedByPublicCouncil';
import {CelebrityLeaders} from '../../turmoil/globalEvents/CelebrityLeaders';
import {CloudSocieties} from '../../turmoil/globalEvents/CloudSocieties';
import {CorrosiveRain} from '../../turmoil/globalEvents/CorrosiveRain';
import {Diversity} from '../../turmoil/globalEvents/Diversity';
import {DryDeserts} from '../../turmoil/globalEvents/DryDeserts';
import {EcoSabotage} from '../../turmoil/globalEvents/EcoSabotage';
import {Election} from '../../turmoil/globalEvents/Election';
import {GenerousFunding} from '../../turmoil/globalEvents/GenerousFunding';
import {GlobalDustStorm} from '../../turmoil/globalEvents/GlobalDustStorm';
import {HomeworldSupport} from '../../turmoil/globalEvents/HomeworldSupport';
import {ImprovedEnergyTemplates} from '../../turmoil/globalEvents/ImprovedEnergyTemplates';
import {JovianTaxRights} from '../../turmoil/globalEvents/JovianTaxRights';
import {MicrogravityHealthProblems} from '../../turmoil/globalEvents/MicrogravityHealthProblems';
import {MinersOnStrike} from '../../turmoil/globalEvents/MinersOnStrike';
import {MudSlides} from '../../turmoil/globalEvents/MudSlides';
import {Pandemic} from '../../turmoil/globalEvents/Pandemic';
import {ParadigmBreakdown} from '../../turmoil/globalEvents/ParadigmBreakdown';
import {Productivity} from '../../turmoil/globalEvents/Productivity';
import {RedInfluence} from '../../turmoil/globalEvents/RedInfluence';
import {Revolution} from '../../turmoil/globalEvents/Revolution';
import {Riots} from '../../turmoil/globalEvents/Riots';
import {ScientificCommunity} from '../../turmoil/globalEvents/ScientificCommunity';
import {SnowCover} from '../../turmoil/globalEvents/SnowCover';
import {SolarFlare} from '../../turmoil/globalEvents/SolarFlare';
import {SolarnetShutdown} from '../../turmoil/globalEvents/SolarnetShutdown';
import {SpinoffProducts} from '../../turmoil/globalEvents/SpinoffProducts';
import {SponsoredProjects} from '../../turmoil/globalEvents/SponsoredProjects';
import {StrongSociety} from '../../turmoil/globalEvents/StrongSociety';
import {SuccessfulOrganisms} from '../../turmoil/globalEvents/SuccessfulOrganisms';
import {VenusInfrastructure} from '../../turmoil/globalEvents/VenusInfrastructure';
import {VolcanicEruptions} from '../../turmoil/globalEvents/VolcanicEruptions';
import {WarOnEarth} from '../../turmoil/globalEvents/WarOnEarth';
import {AsteroidMining} from '../../turmoil/globalEvents/AsteroidMining';
import {Sabotage} from '../../turmoil/globalEvents/Sabotage';
import {InterplanetaryTrade} from '../../turmoil/globalEvents/InterplanetaryTrade';

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

